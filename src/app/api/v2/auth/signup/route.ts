/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse, NextRequest } from "next/server";
import pool from "@/lib/db";
import { encrypt } from "@/lib/jwt";
import { createSession } from "@/lib/cookie";
import bcryptjs from "bcryptjs";

function jsonError(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

export async function POST(req: NextRequest) {
  const client = await pool.connect();

  try {
    const body = await req.json();
    const { empID, email, password, first_name, last_name, group_id } = body;
    console.log("Signup request body:", body);
    // Validation
    if (!email || !password || !first_name || !last_name || !group_id) {
      return jsonError("All fields are required (backend)", 400);
    }

    if (!email.includes("@")) {
      return jsonError("Invalid email format", 400);
    }

    if (password.length < 6) {
      return jsonError("Password must be at least 6 characters", 400);
    }

    if (first_name.trim().length === 0 || last_name.trim().length === 0) {
      return jsonError("Name fields cannot be empty", 400);
    }

    // Check if email already exists
    const existingUser = await client.query(
      `SELECT emp_id FROM employee WHERE LOWER(email) = LOWER($1)`,
      [email]
    );

    if (existingUser.rows.length > 0) {
      return jsonError("Email already in use", 409);
    }

    // Hash password
    const hashedPassword = await bcryptjs.hash(password, 10);

    // Create user
    const userResult = await client.query(
      `
      INSERT INTO employee (emp_id, first_name, last_name, email, password_hash, group_id)
      VALUES ($1, $2, $3, $4, $5, $6::uuid)
      RETURNING emp_id
      `,
      [empID, first_name, last_name, email, hashedPassword, group_id]
    );

    const userInfo = await client.query(
      `SELECT e.emp_id, e.first_name, e.last_name, e.email, g.group_name FROM employee e JOIN "group" g ON g.group_id = e.group_id WHERE e.emp_id = $1`,
      [userResult.rows[0].emp_id]
    );

    if (userResult.rows.length === 0) {
      return jsonError("Failed to create user", 500);
    }

    const user = userInfo.rows[0];

    // Fetch department info for the group
    // const deptResult = await client.query(
    //   `SELECT dept_id, dept_name FROM department WHERE dept_id = (SELECT dept_id FROM "group" WHERE group_id = $1)`,
    //   [group_id]
    // );

    // const dept = deptResult.rows[0];

    // Build user object matching login response structure
    const responseUser = {
      empId: user.emp_id,
      firstName: user.first_name,
      lastName: user.last_name,
      email: user.email,
      group: {
        id: userInfo.rows[0].group_id,
        name: userInfo.rows[0].group_name,
      },
    };

    // Create JWT token
    const token = await encrypt({ user: responseUser });

    // Store JWT in cookie
    await createSession(token);

    return NextResponse.json({
      token,
      user: responseUser,
    });
  } catch (error) {
    console.error("Signup error:", error);
    if (error instanceof Error && error.message.includes("duplicate key")) {
      return jsonError("Email already in use", 409);
    }
    return jsonError("Internal server error", 500);
  } finally {
    client.release();
  }
}
