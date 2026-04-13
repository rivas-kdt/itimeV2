import { readSession } from "@/lib/cookie";
import pool from "@/lib/db";
import { decrypt } from "@/lib/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: Request) {
  const client = await pool.connect();
  try {
    const { searchParams } = new URL(req.url);
    const q = (searchParams.get("q") ?? "").toLowerCase();
    const own = searchParams.get("own") === "true";
    const types = searchParams.getAll("type") ?? [];
    const locations = searchParams.getAll("location") ?? [];
    const dateFrom = searchParams.get("dateFrom") ?? "";
    const dateTo = searchParams.get("dateTo") ?? "";
    const limit = Math.min(Number(searchParams.get("limit") ?? 20), 100);
    const offset = Number(searchParams.get("offset") ?? 0);
    const workOrderId = searchParams.get("wo") ?? "";
    const workCodeId = searchParams.get("wc") ?? "";
    const constructionId = searchParams.get("ci") ?? "";
    const othersId = searchParams.get("o") ?? "";

    const where: string[] = [];
    const values: any[] = [];

    if (q) {
      values.push(`%${q}%`);
      where.push(`LOWER(wo.work_order) LIKE $${values.length}`);
    }

    const token = await readSession();
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const decoded = await decrypt(token);
    if (!decoded?.user?.empId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const inspectorId = decoded.user.empId;

    if (own === true) {
      values.push(inspectorId);
      where.push(`i.inspector_id = $${values.length}`);
    }

    if (types.length) {
      values.push(types);
      where.push(`i.type = ANY($${values.length}::type_enum[])`);
    }

    if (locations.length) {
      values.push(locations);
      where.push(`l.location = ANY($${values.length}::text[])`);
    }

    if (dateFrom.length) {
      values.push(dateFrom);
      where.push(`i.inspection_date::date >= $${values.length}::date`);
    }

    if (dateTo.length) {
      values.push(dateTo);
      where.push(`i.inspection_date::date <= $${values.length}::date`);
    }

    if (workOrderId.length) {
      values.push(workOrderId);
      where.push(`wo.id = $${values.length}`);
    }

    if (workCodeId.length) {
      values.push(workCodeId);
      where.push(`wc.id = $${values.length}`);
    }

    if (constructionId.length) {
      values.push(constructionId);
      where.push(`ci.id = $${values.length}`);
    }

    if (othersId.length) {
      values.push(othersId);
      where.push(`o.id = $${values.length}`);
    }

    const whereSQL = where.length ? `WHERE ${where.join(" AND ")}` : "";

    const totalRes = await client.query(
      `SELECT COUNT(*)::int AS total
      FROM inspection_v2 i
      JOIN work_order_v2 wo ON wo.id = i.work_order_id
      JOIN work_code wc ON wc.id = i.work_code_id
      JOIN construction_item ci ON ci.id = i.construction_item_id
      JOIN others o ON o.id = i.others_id
      JOIN location_v2 l ON l.id = i.location_id
      ${whereSQL}`,
      values
    );

    values.push(limit, offset);
    const query = `SELECT
        i.inspection_id::text AS id,
        wo.work_order AS "workOrder",
        wc.work_code AS "workCode",
        ci.construction_item AS "construction",
        o.others AS "others",
        to_char(i.inspection_date::date, 'YYYY-MM-DD') AS date,
		    COALESCE(TO_CHAR((i.end_time - i.start_time),'HH24:MI:SS'), '00:00:00') AS "duration",
        TO_CHAR(i.end_time, 'HH24:MI') as end_time,
        TO_CHAR(i.start_time, 'HH24:MI') as start_time,
        i.type AS type,
        l.location AS location
        FROM inspection_v2 i
        JOIN work_order_v2 wo ON wo.id = i.work_order_id
        JOIN work_code wc ON wc.id = i.work_code_id
        JOIN construction_item ci ON ci.id = i.construction_item_id
        JOIN others o ON o.id = i.others_id
        JOIN location_v2 l ON l.id = i.location_id
        ${whereSQL} AND i.status='ended'
        ORDER BY i.inspection_date DESC
        LIMIT $${values.length - 1} OFFSET $${values.length};`;

    const recordsRes = await client.query(query, values);

    const rows = recordsRes.rows.map((r: any) => ({
      id: r.id,
      workOrder: r.workOrder,
      workCode: r.workCode,
      construction: r.construction,
      others: r.others,
      date: r.date,
      startTime: r.start_time,
      endTime: r.end_time,
      duration: r.duration,
      type: r.type,
      location: r.location,
    }));

    return NextResponse.json({ total: totalRes.rows[0].total, rows });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { error: errorMessage || "Failed to fetch inspections" },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}

export async function POST(req: NextRequest) {
  const client = await pool.connect();
  const token = await readSession();
  if (!token) {
    return NextResponse.json("Unauthorized", { status: 401 });
  }

  const decoded = await decrypt(token);
  if (!decoded?.user?.empId) {
    return NextResponse.json("Invalid session", { status: 401 });
  }

  const inspectorId = decoded.user.empId;
  const body = await req.json();

  const workOrderId = body?.workOrderId;
  const type = body?.type;
  const locationId = body?.locationId;
  const constructionItemId = body?.constructionItemId;
  const workCodeId = body?.workCodeId;
  const othersId = body?.othersId;
  const inspectionDate = body?.inspection_date;
  const startTime = body?.startTime;
  const endTime = body?.endTime;
  const status = body?.status;

  try {
    // const currentDate = new Date().toISOString().split("T")[0]; // YYYY-MM-DD format

    const now = new Date();
    const currentDate =
      now.getFullYear() +
      "-" +
      String(now.getMonth() + 1).padStart(2, "0") +
      "-" +
      String(now.getDate()).padStart(2, "0");

    const id = await client.query(
      `
        INSERT INTO inspection_v2 ( work_order_id, inspector_id, type, location_id, construction_item_id, work_code_id, others_id, inspection_date, start_time, end_time, status, created_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
        RETURNING inspection_id
        `,
      [
        workOrderId,
        inspectorId,
        type,
        locationId,
        constructionItemId,
        workCodeId,
        othersId,
        inspectionDate || currentDate,
        startTime,
        endTime,
        status,
        new Date().toISOString(),
      ]
    );
    return NextResponse.json(
      {
        data: id.rows[0].inspection_id,
        message: "Inspection created successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/v2/inspections error:", error);
    return NextResponse.json("Interval server error", { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  const client = await pool.connect();
  try {
    const { searchParams } = new URL(req.url);
    const inspectionId = searchParams.get("id");

    if (!inspectionId) {
      return NextResponse.json(
        { error: "Inspection ID is required" },
        { status: 400 }
      );
    }

    const token = await readSession();
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = await decrypt(token);
    if (!decoded?.user?.empId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    // Get work order details from query parameters
    const workOrderId = searchParams.get("wo");
    const constructionItemId = searchParams.get("ci");
    const workCodeId = searchParams.get("wc");
    const othersId = searchParams.get("o");

    // Get other fields from body
    const { startTime, endTime, status } = body;

    const fields: string[] = [];
    const values: any[] = [];

    if (workOrderId) {
      values.push(workOrderId);
      fields.push(`work_order_id = $${values.length}`);
    }

    if (constructionItemId) {
      values.push(constructionItemId);
      fields.push(`construction_item_id = $${values.length}`);
    }

    if (workCodeId) {
      values.push(workCodeId);
      fields.push(`work_code_id = $${values.length}`);
    }

    if (othersId) {
      values.push(othersId);
      fields.push(`others_id = $${values.length}`);
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

    if (fields.length === 0) {
      return NextResponse.json(
        { error: "No fields to update" },
        { status: 400 }
      );
    }

    values.push(inspectionId);
    const updateQuery = `
      UPDATE inspection_v2
      SET ${fields.join(", ")}
      WHERE inspection_id::text = $${values.length}
      RETURNING inspection_id`;

    const result = await client.query(updateQuery, values);

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: "Inspection not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Inspection updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("PATCH /api/v2/inspections error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}
