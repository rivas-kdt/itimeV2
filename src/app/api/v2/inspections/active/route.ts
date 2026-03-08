import { readSession } from "@/lib/cookie";
import pool from "@/lib/db";
import { decrypt } from "@/lib/jwt";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const client = await pool.connect();
  try {
    const token = await readSession();
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = await decrypt(token);
    if (!decoded?.user?.empId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const inspectorId = decoded.user.empId;

    // Query to find active inspection (status = 'active') for the current user
    const query = `
      SELECT
        i.inspection_id,
        wo.work_order AS "workOrder",
        wc.work_code AS "workCode",
        ci.construction_item AS "construction",
        o.others AS "others",
        l.location AS "location",
        to_char(i.inspection_date::date, 'YYYY-MM-DD') AS "date",
        i.start_time,
        i.end_time,
        i.type,
        i.status
      FROM inspection_v2 i
      JOIN work_order_v2 wo ON wo.id = i.work_order_id
      JOIN work_code wc ON wc.id = i.work_code_id
      JOIN construction_item ci ON ci.id = i.construction_item_id
      JOIN others o ON o.id = i.others_id
      JOIN location_v2 l ON l.id = i.location_id
      WHERE i.inspector_id = $1 AND i.status = 'active'
      ORDER BY i.created_at DESC
      LIMIT 1;
    `;

    const result = await client.query(query, [inspectorId]);

    if (result.rows.length === 0) {
      return NextResponse.json({ data: null });
    }

    const inspection = result.rows[0];
    return NextResponse.json({
      data: {
        inspection_id: inspection.inspection_id,
        workOrder: inspection.workOrder,
        workCode: inspection.workCode,
        construction: inspection.construction,
        others: inspection.others,
        location: inspection.location,
        date: inspection.date,
        start_time: inspection.start_time,
        end_time: inspection.end_time,
        type: inspection.type,
        status: inspection.status,
      },
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { error: errorMessage || "Failed to fetch active inspection" },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}
