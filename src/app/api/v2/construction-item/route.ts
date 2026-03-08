import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET() {
  const client = await pool.connect();
  try {
    const query = `SELECT id, construction_item AS "value" FROM construction_item ORDER BY construction_item`;
    const result = await client.query(query);

    return NextResponse.json(result.rows, { status: 200 });
  } catch (error) {
    console.error("GET /api/v2/construction-item error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  } finally {
    client.release();
  }
}

export async function POST(req: Request) {
  const client = await pool.connect();
  try {
    const body = await req.json();
    const { construction_item } = body;

    if (!construction_item) {
      return NextResponse.json({ error: "Construction item is required" }, { status: 400 });
    }

    const query = `INSERT INTO construction_item (construction_item) VALUES ($1) RETURNING id, construction_item AS "value"`;
    const result = await client.query(query, [construction_item]);

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) {
    console.error("POST /api/v2/construction-item error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  } finally {
    client.release();
  }
}