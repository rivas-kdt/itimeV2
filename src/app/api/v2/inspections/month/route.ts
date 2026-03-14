import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { decrypt } from "@/lib/jwt";
import { readSession } from "@/lib/cookie";

const DAY_NAMES = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export async function GET(req: Request) {
  const client = await pool.connect();

  try {
    const { searchParams } = new URL(req.url);
    const tz = searchParams.get("tz") ?? "Asia/Tokyo";
    const self = searchParams.get("self") === "true";
    const monthParam = searchParams.get("month");

    let joinCondition = `(i.inspection_date AT TIME ZONE $1) >= d.day
    AND (i.inspection_date AT TIME ZONE $1) < d.day + interval '1 day'`;
    const params: any[] = [tz];

    if (self) {
      const token = await readSession();
      if (!token) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      const decoded = await decrypt(token);
      if (!decoded?.user?.empId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      joinCondition += ` AND i.inspector_id = $2 AND i.status = 'ended'`;
      params.push(decoded.user.empId);
    }

    const getMonthStart = monthParam
      ? `make_date(EXTRACT(YEAR FROM NOW())::int, ${monthParam}::int, 1)`
      : `date_trunc('month', NOW() AT TIME ZONE $1)`;

    const q = `WITH bounds AS (
  SELECT
    ${getMonthStart} AS start_month,
    ${getMonthStart} + interval '1 month' AS end_month
),
days AS (
  SELECT generate_series(
    (SELECT start_month FROM bounds),
    (SELECT end_month FROM bounds) - interval '1 day',
    interval '1 day'
  ) AS day
)
SELECT
  TO_CHAR(d.day, 'DD') AS day,
  COUNT(i.*)::int AS total
FROM days d
LEFT JOIN inspection_v2 i
  ON ${joinCondition}
GROUP BY d.day
ORDER BY d.day;`;

    const res = await client.query(q, params);
    const data = res.rows.map((row) => ({
      day: row.day,
      "Inspections: ": row.total,
    }));
    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { error: errorMessage || "Failed to fetch weekly inspection data" },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}
