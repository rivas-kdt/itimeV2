import { NextResponse, NextRequest } from "next/server";
import pool from "@/lib/db";
import { readSession } from "@/lib/cookie";
import { decrypt } from "@/lib/jwt";

export async function GET(req: NextRequest) {
  const client = await pool.connect();

  try {
    const token = await readSession();
    if (!token) {
      return NextResponse.json("Unauthorized", {status:401})
    }

    const decoded = await decrypt(token);
    if (!decoded?.user?.empId) {
      return NextResponse.json("Invalid session", {status:401})
    }

    const emp_id = decoded.user.empId;

    const result = await client.query(
      `
      SELECT 
        e.emp_id,
        e.first_name,
        e.last_name,
        e.email,
        e.group_id,
        g.group_name,
        e.created_at
      FROM employee e
      LEFT JOIN "group" g ON e.group_id = g.group_id
      WHERE e.emp_id = $1
      `,
      [emp_id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json("User not found", {status:404})
    }

    const profile = result.rows[0];

    return NextResponse.json(profile);
  } catch (error) {
    console.error("Error fetching profile:", error);
      return NextResponse.json("Internal server error", {status:500})
  } finally {
    client.release();
  }
}

export async function PUT(req: NextRequest) {
  const client = await pool.connect();

  try {
    const token = await readSession();
    if (!token) {
      return NextResponse.json("Unauthorized", {status:401})
    }

    const decoded = await decrypt(token);
    if (!decoded?.user?.empId) {
      return NextResponse.json("Invalid session", {status:401})
    }

    const emp_id = decoded.user.empId;
    const body = await req.json();
    const { first_name, last_name, email, group_id } = body;

    const updates: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    if (first_name !== undefined) {
      updates.push(`first_name = $${paramIndex++}`);
      values.push(first_name);
    }

    if (last_name !== undefined) {
      updates.push(`last_name = $${paramIndex++}`);
      values.push(last_name);
    }

    if (email !== undefined) {
      updates.push(`email = $${paramIndex++}`);
      values.push(email);
    }

    if (group_id !== undefined) {
      updates.push(`group_id = $${paramIndex++}`);
      values.push(group_id);
    }

    if (updates.length === 0) {
      return NextResponse.json("No fields to update", {status:400})
    }

    values.push(emp_id);
    const updateSQL = updates.join(", ");

    const result = await client.query(
      `
      UPDATE employee
      SET ${updateSQL}
      WHERE emp_id = $${paramIndex}
      RETURNING emp_id, first_name, last_name, email, group_id, created_at
      `,
      values
    );

    if (result.rows.length === 0) {
      return NextResponse.json("User not found", {status:404})
    }

    // Fetch full profile with group name
    const fullProfile = await client.query(
      `
      SELECT
        e.emp_id,
        e.first_name,
        e.last_name,
        e.email,
        e.group_id,
        g.group_name,
        e.created_at
      FROM employee e
      LEFT JOIN "group" g ON e.group_id = g.group_id
      WHERE e.emp_id = $1
      `,
      [emp_id]
    );

    return NextResponse.json(fullProfile.rows[0]);
  } catch (error) {
    console.error("Error updating profile:", error);
    if (error instanceof Error && error.message.includes("duplicate key")) {
      return NextResponse.json("Email already in use", {status:409})
    }
      return NextResponse.json("Internal server error", {status:500})
  } finally {
    client.release();
  }
}
