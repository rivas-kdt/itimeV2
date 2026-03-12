import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET(req: Request, ctx: any) {
  const client = await pool.connect();
  try {
    const { id } = await ctx.params;

    const query = `
      SELECT
  wo.id::text AS id,
  wo.work_order AS "workOrder",
  ci.construction_item AS "construction",
  wc.work_code AS "workCode",
  o.others AS "others",
  COUNT(i.inspection_id)::int AS "inspectionCount"
FROM inspection_v2 i
LEFT JOIN work_order_v2 wo ON wo.id = i.work_order_id
LEFT JOIN construction_item ci ON ci.id = i.construction_item_id
LEFT JOIN work_code wc ON wc.id = i.work_code_id
LEFT JOIN others o ON o.id = i.others_id
WHERE (
  i.work_order_id,
  i.construction_item_id,
  i.work_code_id,
  i.others_id
) = (
  SELECT
    work_order_id,
    construction_item_id,
    work_code_id,
    others_id
  FROM inspection_v2
  WHERE inspection_id::text = $1
)
GROUP BY
  wo.id,
  wo.work_order,
  ci.construction_item,
  wc.work_code,
  o.others;`;

    const result = await client.query(query, [id]);

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Work order not found" }, { status: 404 });
    }

    return NextResponse.json(result.rows[0], { status: 200 });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { error: errorMessage || "Failed to fetch work order" },
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

    const { constructionItem, workCode, others } = body;

    const fields: string[] = [];
    const values: any[] = [];

    if (constructionItem !== undefined) {
      const ciQuery = `SELECT id FROM construction_item WHERE construction_item = $1`;
      const ciResult = await client.query(ciQuery, [constructionItem]);
      if (ciResult.rows.length > 0) {
        values.push(ciResult.rows[0].id);
        fields.push(`construction_item_id = $${values.length}`);
      }
    }

    if (workCode !== undefined) {
      const wcQuery = `SELECT id FROM work_code WHERE work_code = $1`;
      const wcResult = await client.query(wcQuery, [workCode]);
      if (wcResult.rows.length > 0) {
        values.push(wcResult.rows[0].id);
        fields.push(`work_code_id = $${values.length}`);
      }
    }

    if (others !== undefined) {
      const oQuery = `SELECT id FROM others WHERE others = $1`;
      const oResult = await client.query(oQuery, [others]);
      if (oResult.rows.length > 0) {
        values.push(oResult.rows[0].id);
        fields.push(`others_id = $${values.length}`);
      }
    }

    if (fields.length === 0) {
      return NextResponse.json({ error: "No fields to update" }, { status: 400 });
    }

    values.push(id);
    const updateQuery = `
      UPDATE work_order_v2
      SET ${fields.join(", ")}
      WHERE id::text = $${values.length}
      RETURNING *;`;

    await client.query(updateQuery, values);

    // Fetch and return the updated record
    const selectQuery = `
      SELECT
        wo.id::text AS id,
        wo.work_order AS "workOrder",
        ci.construction_item AS "construction",
        wc.work_code AS "workCode",
        o.others AS "others",
        COUNT(i.inspection_id)::int AS "inspectionCount"
      FROM work_order_v2 wo
      LEFT JOIN construction_item ci ON ci.id = wo.construction_item_id
      LEFT JOIN work_code wc ON wc.id = wo.work_code_id
      LEFT JOIN others o ON o.id = wo.others_id
      LEFT JOIN inspection_v2 i ON i.work_order_id = wo.id
      WHERE wo.id::text = $1
      GROUP BY wo.id, wo.work_order, ci.construction_item, wc.work_code, o.others;`;

    const result = await client.query(selectQuery, [id]);
    return NextResponse.json(result.rows[0], { status: 200 });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { error: errorMessage || "Failed to update work order" },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}
