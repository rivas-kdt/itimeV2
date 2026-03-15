import pool from "@/lib/db";
import { readSession } from "@/lib/cookie";
import { decrypt } from "@/lib/jwt";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const client = await pool.connect();
  try {
    const { searchParams } = new URL(req.url);
    const self = searchParams.get("self");

    const tz = "Asia/Tokyo";
    
    let inspectorFilter = "";
    let params: any[] = [tz];

    console.log("Received request for inspection summary with self =", self);
    if (self === "true") {
      const token = await readSession();
      if (!token) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      const decoded = await decrypt(token);
      if (!decoded?.user?.empId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      inspectorFilter = ` AND i.inspector_id = $${params.length + 1}`;
      params.push(decoded.user.empId);
    }

    const query = `
        WITH now_local AS (SELECT (NOW() AT TIME ZONE $1) AS n),
        bounds AS (SELECT 
        date_trunc('day',   n) AS day_start,
        date_trunc('month', n) AS month_start,
        date_trunc('year',  n) AS year_start,
        (date_trunc('week', n + interval '1 day') - interval '1 day') AS week_start FROM now_local)
        SELECT
          (SELECT COUNT(*)::int FROM inspection_v2 i WHERE 1=1${inspectorFilter}) AS total,
          (SELECT COUNT(*)::int FROM inspection_v2 i, bounds b
            WHERE (i.inspection_date AT TIME ZONE $1) >= b.day_start${inspectorFilter}
          ) AS today,
          (SELECT COUNT(*)::int FROM inspection_v2 i, bounds b
            WHERE (i.inspection_date AT TIME ZONE $1) >= b.week_start${inspectorFilter}
          ) AS this_week,
          (SELECT COUNT(*)::int FROM inspection_v2 i, bounds b
            WHERE (i.inspection_date AT TIME ZONE $1) >= b.month_start${inspectorFilter}
          ) AS this_month,
          (SELECT COUNT(*)::int FROM inspection_v2 i, bounds b
            WHERE (i.inspection_date AT TIME ZONE $1) >= b.year_start${inspectorFilter}
          ) AS this_year;`
    const r = await client.query(query, params);
    const row = r.rows[0];
    return NextResponse.json({
      inspection: { total: row.total },
      inspectionToday: { total: row.today },
      inspectionThisWeek: { total: row.this_week },
      inspectionThisMonth: { total: row.this_month },
      inspectionThisYear: { total: row.this_year },
    }, { status: 200, headers: { "Content-Type": "application/json" } });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: errorMessage || "Failed to fetch inspection summary" }, { status: 500 });
  } finally {
    client.release();
  }
} 