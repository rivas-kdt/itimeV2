import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import { readSession } from "@/lib/cookie";
import { decrypt } from "@/lib/jwt";

export async function GET(req: NextRequest, ctx: any) {
  const token = await readSession();

  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const decoded = await decrypt(token);

  if (!decoded?.user?.empId) {
    return NextResponse.json({ message: "Invalid session" }, { status: 401 });
  }

  const { id: inspectionId } = await ctx.params;
  const client = await pool.connect();
  try {
    const result = await client.query(
      `
      SELECT
        i.inspection_id,
        wo.work_order AS "workOrder",
        wo.id AS "workOrderId",
        i.type,
        l.location AS "location",
        l.id AS "locationId",
        ci.construction_item AS "construction",
        ci.id AS "constructionItemId",
        wc.work_code AS "workCode",
        wc.id AS "workCodeId",
        o.others AS "others",
        o.id AS "othersId",
        i.start_time,
        i.end_time,
        i.created_at,
        to_char((i.inspection_date AT TIME ZONE 'Asia/Tokyo')::date, 'YYYY-MM-DD') AS inspection_date,
        i.status
      FROM inspection_v2 i
      JOIN work_order_v2 wo ON wo.id = i.work_order_id
      LEFT JOIN location_v2 l ON l.id = i.location_id
      LEFT JOIN construction_item ci ON ci.id = i.construction_item_id
      LEFT JOIN work_code wc ON wc.id = i.work_code_id
      LEFT JOIN others o ON o.id = i.others_id
      WHERE i.inspection_id = $1
      `,
      [inspectionId]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { message: "Inspection not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        data: result.rows[0],
        message: "Inspection retrieved successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("GET /api/v2/inspections/[id] error:", error);

    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}

export async function PATCH(req: Request, ctx: any) {
  const client = await pool.connect();
  try {
    const { id } = await ctx.params;
    const body = await req.json();
    const { date, startTime, endTime, type, location, status } = body;

    const fields: string[] = [];
    const values: any[] = [];

    if (date) {
      values.push(date);
      fields.push(`inspection_date = $${values.length}`);
    }
    if (startTime !== undefined) {
      values.push(startTime);
      fields.push(`start_time = $${values.length}`);
    }

    if (endTime !== undefined) {
      values.push(endTime);
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

export async function DELETE(req: NextRequest, ctx: any) {
  const token = await readSession();

  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const decoded = await decrypt(token);

  if (!decoded?.user?.empId) {
    return NextResponse.json({ message: "Invalid session" }, { status: 401 });
  }

  const { id: inspectionId } = await ctx.params;
  const client = await pool.connect();
  try {
    const result = await client.query(
      `DELETE FROM inspection_v2 WHERE inspection_id = $1 RETURNING inspection_id`,
      [inspectionId]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { message: "Inspection not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Inspection deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("DELETE /api/v2/inspections/[id] error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}
