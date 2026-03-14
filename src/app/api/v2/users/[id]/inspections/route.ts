/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET(req: Request, ctx: any) {
  const client = await pool.connect();
  const { id: userId } = await ctx.params;

  const { searchParams } = new URL(req.url);
  const search = (searchParams.get("search") ?? "").trim();
  const type = (searchParams.get("type") ?? "").trim();
  const location = (searchParams.get("location") ?? "").trim();
  const format = (searchParams.get("format") ?? "").trim();
  const month = searchParams.get("month");
  const year = searchParams.get("year");

  const values: any[] = [userId];
  const where: string[] = [`i.inspector_id = $1::int`];

  if (search) {
    values.push(`%${search.toLowerCase()}%`);
    where.push(`LOWER(wo.work_order) LIKE $${values.length}`);
  }

  if (type) {
    values.push(type);
    where.push(`i."type" = CAST($${values.length} AS type_enum)`);
  }

  if (location) {
    values.push(location);
    where.push(`l.location = $${values.length}`);
  }
  if (format === "monthly") {
    let monthFilter = "";
    if (month && year) {
      const monthStr = String(parseInt(month)).padStart(2, "0");
      values.push(`${year}-${monthStr}`);
      monthFilter = `AND TO_CHAR(i.inspection_date, 'YYYY-MM') = $${values.length}::text`;
    } else if (year) {
      values.push(`${year}%`);
      monthFilter = `AND TO_CHAR(i.inspection_date, 'YYYY') = $${values.length}::text`;
    }
    const monthlySql = `
    SELECT
  wo.work_order AS "workOrder",
  wc.work_code AS "workCode",
  ci.construction_item AS "construction",
  o.others AS "others",
  EXTRACT(DAY FROM i.inspection_date)::int AS day,
  TO_CHAR(i.inspection_date, 'YYYY-MM') AS "monthYear",

  -- decimal hours rounded to nearest 0.25
TO_CHAR(
  CEILING((SUM(EXTRACT(EPOCH FROM (i.end_time - i.start_time))) / 3600.0) * 2) / 2,
  'FM999990.00'
) AS "duration"

FROM inspection_v2 i
JOIN work_order_v2 wo ON wo.id = i.work_order_id
JOIN work_code wc ON wc.id = i.work_code_id
JOIN construction_item ci ON ci.id = i.construction_item_id
JOIN others o ON o.id = i.others_id
JOIN location_v2 l ON l.id = i.location_id
      WHERE ${where.join(" AND ")}
      ${monthFilter}
      GROUP BY
  wo.work_order,
  wc.work_code,
  ci.construction_item,
  o.others,
  EXTRACT(DAY FROM i.inspection_date),
  TO_CHAR(i.inspection_date, 'YYYY-MM')

ORDER BY
  wo.work_order, day;`;

    const result = await client.query(monthlySql, values);
    const rows = result.rows;
    client.release();

    const workOrderMap: Record<string, any> = {};

    rows.forEach((row: any, index) => {
      const key = `${row.workOrder}-${row.construction}-${row.workCode}-${row.others}`;

      if (!workOrderMap[key]) {
        workOrderMap[key] = {
          workOrder: row.workOrder,
          construction: row.construction,
          workCode: row.workCode.toString(),
          others: row.others.toString(),
          monthlyData: {},
        };
      }

      if (!workOrderMap[key].monthlyData[row.monthYear]) {
        workOrderMap[key].monthlyData[row.monthYear] = {};
      }

      const dayKey = row.day.toString();
      const hours = row.duration;
      workOrderMap[key].monthlyData[row.monthYear][dayKey] =
        (workOrderMap[key].monthlyData[row.monthYear][dayKey] || 0) + hours;
    });

    const data = Object.values(workOrderMap);
    return NextResponse.json({ rows: data, total: data.length });
  }

  const sql = `
    SELECT
	i.inspection_id,
        wo.work_order AS "workOrder",
       wc.work_code AS "workCode",
        ci.construction_item AS "construction",
        o.others AS "others",
      to_char(i.inspection_date, 'YYYY-MM-DD') AS date,
      TO_CHAR((i.end_time - i.start_time),'HH24:MI:SS') AS "duration",
      i."type"::text AS type,
      l.location AS location
    FROM inspection_v2 i
    JOIN work_order_v2 wo ON wo.id = i.work_order_id
	JOIN work_code wc ON wc.id = i.work_code_id
	  JOIN construction_item ci ON ci.id = i.construction_item_id
	  JOIN others o ON o.id = i.others_id
    JOIN location_v2 l ON l.id = i.location_id
    WHERE ${where.join(" AND ")}
    ORDER BY i.inspection_date DESC;
  `;

  const { rows } = await client.query(sql, values);
  client.release();
  return NextResponse.json(rows);
}
