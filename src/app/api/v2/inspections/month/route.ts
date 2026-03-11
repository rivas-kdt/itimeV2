import { NextResponse } from "next/server";
import pool from "@/lib/db";

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

    const q = `WITH bounds AS (
  SELECT
    date_trunc('month', NOW()) AS start_month,
    date_trunc('month', NOW()) + interval '1 month' AS end_month
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
  ON i.inspection_date >= d.day
  AND i.inspection_date < d.day + interval '1 day'
GROUP BY d.day
ORDER BY d.day;`;

    const res = await client.query(q);
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
