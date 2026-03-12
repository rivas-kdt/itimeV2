import { readSession } from "@/lib/cookie";
import pool from "@/lib/db";
import { decrypt } from "@/lib/jwt";
import { NextResponse } from "next/server";

export async function GET (req: Request) {
  const client = await pool.connect()

  try {
    const { searchParams } = new URL(req.url)
    const q = (searchParams.get("q")?? "").toLowerCase()
    const own = searchParams.get("own") === "true"

    const token = await readSession()

    if(!token){
      return NextResponse.json("Unauthorized", {status:401})
    }

    const decoded = await decrypt(token)
    if(!decoded?.user?.empId){
      return NextResponse.json("Invalid session", {status: 401})
    }

    const inspectorId = decoded.user.empId;

    const values: any[] = []
    const where: string[] = []

    if(q){
      values.push(`%${q}%`)
      where.push(`LOWER(wo.work_order) LIKE $${values.length}`)
    }

    if (own === true){
      values.push(inspectorId)
      where.push(`i.inspector_id = $${values.length}`)
    }

    const whereSQL = where.length ? `WHERE ${where.join(" AND ")}` : "";

    const query = `SELECT
    ROW_NUMBER() OVER (ORDER BY wo.work_order) AS id,
    wo.work_order AS "workOrder",
    wo.id AS "workOrderId",
    wc.work_code AS "workCode",
    wc.id AS "workCodeId",
    c.construction_item AS "constructionItem",
    c.id AS "constructionItemId",
    o.others,
    o.id AS "othersId"
    FROM inspection_v2 i
    JOIN work_order_v2 wo ON wo.id = i.work_order_id
    JOIN work_code wc ON wc.id = i.work_code_id
    JOIN construction_item c ON c.id = i.construction_item_id
    JOIN others o ON o.id = i.others_id
    ${whereSQL}
    GROUP BY wo.work_order, wc.work_code, c.construction_item, o.others, wo.id, wc.id, c.id, o.id`

    const workOrders = await client.query(query, values)
    
    return NextResponse.json({total: workOrders.rowCount, rows: workOrders.rows})
  } catch (error) {
    console.error(error)
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(errorMessage || "Failed to fetch work-orders", { status: 500})
  } finally {
    client.release()
  }
}