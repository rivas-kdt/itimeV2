import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET() {
  const client = await pool.connect();
  try {
    const query = `SELECT id, others AS "value" FROM others ORDER BY others`;
    const result = await client.query(query);

    return NextResponse.json(result.rows, { status: 200 });
  } catch (error) {
    console.error("GET /api/v2/others error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  } finally {
    client.release();
  }
}

export async function POST(req: Request) {
  const client = await pool.connect();
  try {
    const body = await req.json();
    const { others } = body;

    if (!others) {
      return NextResponse.json({ error: "Others is required" }, { status: 400 });
    }

    const query = `INSERT INTO others (others) VALUES ($1) RETURNING id, others AS "value"`;
    const result = await client.query(query, [others]);

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) {
    console.error("POST /api/v2/others error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  } finally {
    client.release();
  }
}