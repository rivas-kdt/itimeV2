/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse, NextRequest } from "next/server";
import pool from "@/lib/db";
import { readSession } from "@/lib/cookie";
import { decrypt } from "@/lib/jwt";

export async function GET(req: NextRequest) {
  const client = await pool.connect()
  try {
    const { searchParams } = new URL(req.url);
    const q = (searchParams.get("q") ?? "").toLowerCase();
    const own = searchParams.get("own") === "true";

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

    const whereSQL = where.length ? `WHERE ${where.join(" AND ")}` : "";

    const query = `SELECT
      ROW_NUMBER() OVER (ORDER BY wo.work_order) AS id,
      wo.work_order AS "workOrder",
      wo.id as "workOrderId",
      wc.work_code AS "workCode",
      wc.id AS "workCodeId",
      c.construction_item AS "constructionItem",
      c.id AS "constructionItemId",
      o.others AS "others",
      o.id AS "othersId"
      FROM inspection_v2 i
      JOIN work_order_v2 wo ON wo.id = i.work_order_id
      JOIN work_code wc ON wc.id = i.work_code_id
      JOIN construction_item c ON c.id = i.construction_item_id
      JOIN others o ON o.id = i.others_id
      ${whereSQL}
      GROUP BY  wo.work_order, wc.work_code, c.construction_item, o.others, wo.id, wc.id, c.id, o.id`

    const workOrders = await client.query(
      query,
      values,
    );
    return NextResponse.json(workOrders.rows);
  } catch (error) {
    console.error("error on GET /api/v2/work-orders error:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: errorMessage || "Failed to fetch inspections" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const client = await pool.connect();
  try {
    const body = await req.json();

    const workOrder = (body?.workOrder || "").trim();
    const constructionItemId = body?.constructionItemId;
    const workCodeId = body?.workCodeId;
    const othersId = body?.othersId;

    const token = await readSession();
    if (!token) {
      return NextResponse.json("Unauthorized", { status: 401 });
    }

    const decoded = await decrypt(token);
    if (!decoded?.user?.empId) {
      return NextResponse.json("Invalid session", { status: 401 });
    }

    const empId = decoded.user.empId;

    if (!workOrder) {
      return NextResponse.json("Work order name is required", { status: 400 });
    }

    const existingRes = await client.query(
      `SELECT id FROM work_order_v2 WHERE work_order = $1`,
      [workOrder]
    );
    let workOrderId: number;
    if (existingRes.rows.length > 0) {
      workOrderId = existingRes.rows[0].id;
    } else {
      // Create new work order
      const createRes = await client.query(
        `
          INSERT INTO work_order_v2 (inspector_id, work_order, work_code_id, construction_item_id, others_id)
          VALUES ($1, $2, $3, $4, $5)
          RETURNING id
          `,
        [
          empId,
          workOrder,
          workCodeId || null,
          constructionItemId || null,
          othersId || null,
        ]
      );
      workOrderId = createRes.rows[0].id;
    }
    return NextResponse.json(
      { workOrderId, message: "Work order processed successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("POST /api/v2/work-orders error:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: errorMessage || "Failed to POST inspections" }, { status: 500 })
  } finally {
    client.release();
  }
}
