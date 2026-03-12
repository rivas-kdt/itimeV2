import pool from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
    const client = await pool.connect()
    try {
        const query =
            `SELECT id, location FROM location_v2 ORDER BY location ASC;`
        const result = await client.query(query);
        return NextResponse.json({ locations: result.rows }, { status: 200 });
    } catch (error: any) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        return NextResponse.json(
            { error: errorMessage || "Failed to fetch locations" },
            { status: 500 }
        );
    } finally {
        client.release();
    }
}
