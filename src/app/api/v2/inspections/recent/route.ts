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
    const tz = 'Asia/Tokyo';

    let whereClause = "WHERE i.status = 'ended'";
    let params: any[] = [tz];

    if (self) {
      const token = await readSession();
      if (!token) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      const decoded = await decrypt(token);
      if (!decoded?.user?.empId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      whereClause = `WHERE i.inspector_id = $2 AND i.status = 'ended'`;
      params.push(decoded.user.empId);
    }

    const q = `
        SELECT
        i.inspection_id,
        to_char((i.inspection_date AT TIME ZONE $1)::date, 'YYYY-MM-DD') AS inspection_date,
        COALESCE(TO_CHAR((i.end_time - i.start_time),'HH24:MI:SS'), '00:00:00') AS duration,
        i.type,
        e.first_name,
        e.last_name
        FROM inspection_v2 i
        JOIN employee e ON e.emp_id = i.inspector_id
        ${whereClause}
        ORDER BY i.inspection_date DESC
        LIMIT $${self ? 3 : 2};`;

    const res = await client.query(q, [...params, limit]);

    const data = res.rows.map((r: any) => ({
      id: r.inspection_id,
      inspector: `${r.first_name} ${r.last_name}`.trim(),
      time: r.duration,
      date: r.inspection_date,
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
