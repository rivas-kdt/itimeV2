/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { decrypt } from "@/lib/jwt";
import { readSession } from "@/lib/cookie";

export async function GET(req: Request) {
  const client = await pool.connect();

  try {
    const { searchParams } = new URL(req.url);
    const tz = searchParams.get("tz") ?? "Asia/Tokyo";
    const range = (searchParams.get("range") ?? "year").toLowerCase();
    const self = searchParams.get("self");

    const params: any[] = [tz];
    let inspectorFilter = "";

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

    let intervalSql = "interval '1 year'";
    if (range === "month") intervalSql = "interval '1 month'";
    if (range === "week") intervalSql = "interval '7 days'";

    const q = `
      SELECT
       CAST(wc.work_code AS text) AS "workCode",
        COUNT(*)::int AS total
      FROM inspection_v2 i
      JOIN work_code wc ON wc.id = i.work_code_id
      WHERE (i.inspection_date AT TIME ZONE $1) >= ((NOW() AT TIME ZONE $1) - ${intervalSql})${inspectorFilter}
      GROUP BY work_code
      ORDER BY work_code ASC;
    `;

    const res = await client.query(q, params);
    const data = res.rows.map((r: any) => ({
      workCode: r.workCode,
      "Inspections: ": Number(r.total),
    }));

    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: errorMessage || "Failed to fetch work code inspection data" }, { status: 500 });
  } finally {
    client.release();
  }
}
