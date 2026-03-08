/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse, NextRequest } from "next/server";
import pool from "@/lib/db";
import { readSession } from "@/lib/cookie";
import { decrypt } from "@/lib/jwt";
import bcryptjs from "bcryptjs";

function jsonError(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

export async function POST(req: NextRequest) {
  const client = await pool.connect();

  try {
    const token = await readSession();
    if (!token) {
      return jsonError("Unauthorized", 401);
    }

    const decoded = await decrypt(token);
    if (!decoded?.user?.empId) {
      return jsonError("Invalid session", 401);
    }

    const emp_id = decoded.user.empId;
    const body = await req.json();
    const { currentPassword, newPassword, confirmPassword } = body;

    if (!currentPassword || !newPassword || !confirmPassword) {
      return jsonError("All fields are required", 400);
    }

    if (newPassword !== confirmPassword) {
      return jsonError("New passwords do not match", 400);
    }

    if (newPassword.length < 6) {
      return jsonError("Password must be at least 6 characters", 400);
    }

    const userResult = await client.query(
      `SELECT emp_id, password_hash FROM employee WHERE emp_id = $1`,
      [emp_id]
    );

    if (userResult.rows.length === 0) {
      return jsonError("User not found", 404);
    }

    const user = userResult.rows[0];

    const isPasswordValid = await bcryptjs.compare(
      currentPassword,
      user.password_hash
    );

    if (!isPasswordValid) {
      return jsonError("Current password is incorrect", 401);
    }

    const hashedPassword = await bcryptjs.hash(newPassword, 10);

    await client.query(
      `UPDATE employee SET password_hash = $1 WHERE emp_id = $2`,
      [hashedPassword, emp_id]
    );

    return NextResponse.json({ message: "Password changed successfully" });
  } catch (error) {
    console.error("Error changing password:", error);
    return jsonError("Internal server error", 500);
  } finally {
    client.release();
  }
}
