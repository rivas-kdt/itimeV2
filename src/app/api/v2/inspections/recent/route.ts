import { readSession } from "@/lib/cookie";
import pool from "@/lib/db";
import { decrypt } from "@/lib/jwt";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const client = await pool.connect();
  try {
    const { searchParams } = new URL(req.url);
    const limit = Math.min(Number(searchParams.get("limit") ?? 15), 50);
    const self = searchParams.get("self") === "true";

    let whereClause = "";
    let params: any[] = [];

    if (self) {
      const token = await readSession();
      if (!token) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      const decoded = await decrypt(token);
      if (!decoded?.user?.empId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      whereClause = `WHERE i.inspector_id = $1`;
      params = [decoded.user.empId];
    }

    const q = `
        SELECT
        i.inspection_id,
        i.inspection_date,
        COALESCE(TO_CHAR((i.end_time - i.start_time),'HH24:MI:SS'), '00:00:00') AS duration,
        i.type,
        e.first_name,
        e.last_name
        FROM inspection_v2 i
        JOIN employee e ON e.emp_id = i.inspector_id
        ${whereClause} AND i.status = 'ended'
        ORDER BY i.inspection_date DESC
        LIMIT $${whereClause ? 2 : 1};`;

    const res = await client.query(q, [...params, limit]);

    const data = res.rows.map((r: any) => ({
      id: r.inspection_id,
      inspector: `${r.first_name} ${r.last_name}`.trim(),
      time: r.duration,
      date: new Date(r.inspection_date).toISOString().slice(0, 10),
      type: r.type,
    }));

    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { error: errorMessage || "Failed to fetch recent inspections" },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}
