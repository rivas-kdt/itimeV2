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

        const q = `WITH bounds AS (SELECT
        date_trunc('day', NOW() AT TIME ZONE $1) AS today,
        date_trunc('day', NOW() AT TIME ZONE $1) - interval '6 days' AS start_day),
        days AS (SELECT generate_series((SELECT start_day FROM bounds),
        (SELECT today FROM bounds),
        interval '1 day'
        ) AS day
         )
        SELECT
        d.day,
        EXTRACT(DOW FROM d.day)::int AS dow,
        COUNT(i.*)::int AS total
        FROM days d
        LEFT JOIN inspection_v2 i
        ON (i.inspection_date AT TIME ZONE $1) >= d.day
        AND (i.inspection_date AT TIME ZONE $1) <  d.day + interval '1 day'
        GROUP BY d.day
        ORDER BY d.day;`;

        const res = await client.query(q, [tz]);
        const counts = Array(7).fill(0);
        for (const row of res.rows) {
            const dow = Number(row.dow);
            if (dow >= 0 && dow <= 6) counts[dow] = Number(row.total);
        }

        const data = res.rows.map((row) => ({
            day: DAY_NAMES[Number(row.dow)],
            "Inspections: ": counts[Number(row.dow)],
        }));
        return NextResponse.json({ data }, { status: 200 });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        return NextResponse.json({ error: errorMessage || "Failed to fetch weekly inspection data" }, { status: 500 });
    } finally {
        client.release();
    }
}
