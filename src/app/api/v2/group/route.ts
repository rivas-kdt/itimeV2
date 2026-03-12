import pool from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  const client = await pool.connect();

  try {
    const result = await client.query(
      `SELECT group_id, group_name FROM "group";`,
      [],
    );
    return NextResponse.json({ groups: result.rows }, { status: 200 });
  } catch (err: any) {
    if (err.name === "AbortError") {
      console.error("GET /api/group timeout");
      return NextResponse.json(
        { error: "Request timeout - server is busy" },
        { status: 504 }
      );
    }
    console.error("GET /api/group error:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}
