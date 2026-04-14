import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function PATCH(req: Request, ctx: any) {
  const client = await pool.connect();
  try {
    const { id } = await ctx.params;
    const body = await req.json();
    const { date, startTime, endTime, type, location, status } = body;

    const fields: string[] = [];
    const values: any[] = [];

    // Get current inspection record to retrieve inspection_date if needed for time updates
    let inspectionDate = date;
    if ((startTime || endTime) && !date) {
      const getDateQuery =
        "SELECT inspection_date FROM inspection_v2 WHERE inspection_id = $1";
      const getDateRes = await client.query(getDateQuery, [id]);
      if (getDateRes.rows.length > 0) {
        inspectionDate = getDateRes.rows[0].inspection_date;
      }
    }

    if (date) {
      values.push(date);
      fields.push(`inspection_date = $${values.length}`);
    }

    if (startTime !== undefined) {
      // Convert "HH:MM" format to full timestamp by combining with inspection date
      const timestamp = new Date(inspectionDate);
      const [hours, minutes] = startTime.split(":").map(Number);
      timestamp.setHours(hours, minutes, 0, 0);
      values.push(timestamp.toISOString());
      fields.push(`start_time = $${values.length}`);
    }

    if (endTime !== undefined) {
      // Convert "HH:MM" format to full timestamp by combining with inspection date
      const timestamp = new Date(inspectionDate);
      const [hours, minutes] = endTime.split(":").map(Number);
      timestamp.setHours(hours, minutes, 0, 0);
      values.push(timestamp.toISOString());
      fields.push(`end_time = $${values.length}`);
    }

    if (status !== undefined) {
      values.push(status);
      fields.push(`status = $${values.length}`);
    }
    if (type) {
      values.push(type);
      fields.push(`type = $${values.length}`);
    }

    let locationId;
    if (location) {
      const locQuery = "SELECT id FROM location_v2 WHERE location = $1";
      const locRes = await client.query(locQuery, [location]);
      if (locRes.rows.length === 0) {
        return NextResponse.json(
          { error: "Invalid location" },
          { status: 400 }
        );
      }
      locationId = locRes.rows[0].id;
      values.push(locationId);
      fields.push(`location_id = $${values.length}`);
    }
    if (!fields.length) {
      return NextResponse.json(
        { error: "No fields to update" },
        { status: 400 }
      );
    }
    values.push(id);
    const query = `UPDATE inspection_v2
    SET ${fields.join(", ")}
    WHERE inspection_id = $${values.length} RETURNING *`;
    await client.query(query, values);
    const outQuery = `SELECT
    i.inspection_id::text AS id,
    wo.work_order AS "WorkOrder",
    to_char((i.inspection_date AT TIME ZONE 'Asia/Tokyo')::date, 'YYYY-MM-DD') AS date,
    TO_CHAR((i.end_time - i.start_time),'HH24:MI') AS "duration",
    i.start_time::text AS start_time,
    i.end_time::text AS end_time,
    i.type AS type,
    l.location AS location,
    COALESCE(ci.construction_item,'') AS construction,
    wc.work_code AS "workCode",
    COALESCE(o.others, '') AS others,
    i.status
    FROM inspection_v2 i
    JOIN work_order_v2 wo ON wo.id = i.work_order_id
    JOIN location_v2 l ON l.id = i.location_id
    JOIN work_code wc ON wc.id = i.work_code_id
    JOIN construction_item ci ON ci.id = i.construction_item_id
    JOIN others o ON o.id = i.others_id
    WHERE i.inspection_id::text = $1
    LIMIT 1;`;
    const updatedRes = await client.query(outQuery, [id]);
    if (updatedRes.rows.length === 0) {
      return NextResponse.json(
        { error: "Inspection not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(updatedRes.rows[0]);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Error updating inspection:", error);
    return NextResponse.json(
      { error: errorMessage || "Failed to update inspection" },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}
