import { NextResponse } from "next/server";
import pool from "@/lib/db";
import bcrypt from "bcryptjs";
import { encrypt } from "@/lib/jwt";
import { createSession } from "@/lib/cookie";

export type ItimeAuthUser = {
  empId: number;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  group: {
    id: string;
    name: string;
    department: {
      id: string;
      name: string;
    };
  } | null;
};
export async function POST(req: Request) {
  const client = await pool.connect()
  try {
    const body = await req.json().catch(() => null);
    const email = (body?.email ?? "").toString().trim().toLowerCase();
    const password = (body?.password ?? "").toString();

    if (!email || !password) {
      return NextResponse.json("Email and password are required", { status: 400 })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json("Invalid email", { status: 400 })
    }

    const query = `SELECT
        e.emp_id,
        e.first_name,
        e.last_name,
        e.email,
        e.role,
        e.password_hash,
        g.group_id,
        g.group_name,
        d.dept_id,
        d.dept_name
      FROM employee e
      LEFT JOIN "group" g ON g.group_id = e.group_id
      LEFT JOIN department d ON d.dept_id = g.dept_id
      WHERE LOWER(e.email) = $1
      LIMIT 1;`

    const res = await client.query(query, [email])

    if (res.rows.length === 0) {
      console.error("User not found")
      return NextResponse.json("User not found.", { status: 401 });
    }

    const row = res.rows[0];
    const passwordValid = await bcrypt.compare(password, row.password_hash);

    if (!passwordValid) {
      console.error("Invalid credentials")
      return NextResponse.json("Invalid credentials.", { status: 401 });
    }

    const user: ItimeAuthUser = {
      empId: row.emp_id,
      firstName: row.first_name,
      lastName: row.last_name,
      email: row.email,
      role: row.role,
      group: row.group_id
        ? {
          id: row.group_id,
          name: row.group_name,
          department: row.dept_id
            ? { id: row.dept_id, name: row.dept_name }
            : { id: "", name: "" },
        }
        : null,
    };

    const token = await encrypt({ user });
    await createSession(token);

    return NextResponse.json({ token, user }, { status: 200 });
  } catch (error) {
    console.error(error)
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(errorMessage || "Failed to fetch work-orders", { status: 500 })
  } finally {
    client.release()
  }
}
