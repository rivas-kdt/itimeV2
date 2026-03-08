import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET() {
  const client = await pool.connect();
  try {
    const query = `SELECT id, work_code AS "value" FROM work_code ORDER BY work_code`;
    const result = await client.query(query);

    return NextResponse.json(result.rows, { status: 200 });
  } catch (error) {
    console.error("GET /api/v2/work-code error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  } finally {
    client.release();
  }
}

export async function POST(req: Request) {
  const client = await pool.connect();
  try {
    const body = await req.json();
    const { work_code } = body;

    if (!work_code) {
      return NextResponse.json({ error: "Work code is required" }, { status: 400 });
    }

    const query = `INSERT INTO work_code (work_code) VALUES ($1) RETURNING id, work_code AS "value"`;
    const result = await client.query(query, [work_code]);

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) {
    console.error("POST /api/v2/work-code error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  } finally {
    client.release();
  }
}