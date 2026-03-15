import { NextResponse } from "next/server";
import pool from "@/lib/db";
import bcryptjs from "bcryptjs";

export async function GET(req: Request) {
    const client = await pool.connect();
    try {
        const { searchParams } = new URL(req.url);
        const search = (searchParams.get("search") ?? "").trim();
        const role = (searchParams.get("role") ?? "ALL").trim();
        const group = (searchParams.get("group") ?? "ALL").trim();

        const values: any[] = [];
        const where: string[] = [];

        if (search) {
            values.push(`%${search.toLowerCase()}%`);
            where.push(`LOWER(e.first_name || ' ' || e.last_name) LIKE $${values.length}`)
        }

        if (role !== "ALL") {
            values.push(role);
            where.push(`e.role = $${values.length}`);
        }

        if (group !== "ALL") {
            values.push(group);
            where.push(`g.group_name = $${values.length}`);
        }

        const sql = `SELECT
        e.emp_id AS "empID",
        e.first_name,
        e.last_name,
        e.email,
        e.role,
        g.group_name AS "group",
        COUNT(i.inspection_id) AS inspections
        FROM employee e
        JOIN "group" g ON g.group_id = e.group_id
        LEFT JOIN inspection_v2 i ON i.inspector_id = e.emp_id
        ${where.length ? `WHERE ${where.join(" AND ")}` : ""}
        GROUP BY e.emp_id, g.group_name
        ORDER BY e.first_name, e.last_name;`;

        const { rows } = await client.query(sql, values);
        return NextResponse.json(rows , { status: 200 });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        return NextResponse.json({ error: errorMessage || "Failed to fetch users" }, { status: 500 });
    } finally {
        client.release();
    }
}

export async function POST(req: Request) {
    const client = await pool.connect();
    const body = await req.json();
    const emp_id = String(body.empID ?? "").trim();
  const first_name = String(body.first_name ?? "").trim();
  const last_name = String(body.last_name ?? "").trim();
  const email = String(body.email ?? "").trim();
  const group_id = String(body.group_id ?? "").trim();
  const access = String(body.access ?? "User").trim();
  const password = String(body.password ?? "").trim();

    if (!emp_id || !first_name || !last_name || !email || !group_id || !password) {
        return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    
    if (access !== "Admin" && access !== "User") {
        return NextResponse.json({ error: "Invalid access role" }, { status: 400 });
    }

    try {
        const hashedPassword = await bcryptjs.hash(password, 10);
        const sql = `INSERT INTO employee (emp_id, first_name, last_name, email, password_hash, group_id, role) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING emp_id;`;
        const values = [
            emp_id,
            first_name,
            last_name,
            email,
            hashedPassword,
            group_id,
            access,
        ];
        const { rows } = await client.query(sql, values);
        return NextResponse.json({ empID: rows[0].emp_id }, { status: 201 });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        return NextResponse.json({ error: errorMessage || "Failed to create user" }, { status: 500 });
    } finally {
        client.release();
    }
}