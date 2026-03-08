/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse, NextRequest } from "next/server";
import pool from "@/lib/db";
import { readSession } from "@/lib/cookie";
import { decrypt } from "@/lib/jwt";
import bcryptjs from "bcryptjs";

export async function POST(req: NextRequest) {
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
    const { currentPassword, newPassword, confirmPassword } = body;

    if (!currentPassword || !newPassword || !confirmPassword) {
      return NextResponse.json("All fields are required", {status:400})
    }

    if (newPassword !== confirmPassword) {
      return NextResponse.json("New password does not match", {status:400})
    }

    if (newPassword.length < 6) {
      return NextResponse.json("Password must be atleast 6 characters", {status:400})
    }

    const userResult = await client.query(
      `SELECT emp_id, password_hash FROM employee WHERE emp_id = $1`,
      [emp_id]
    );

    if (userResult.rows.length === 0) {
      return NextResponse.json("User not found", {status:404})
    }

    const user = userResult.rows[0];

    const isPasswordValid = await bcryptjs.compare(
      currentPassword,
      user.password_hash
    );

    if (!isPasswordValid) {
      return NextResponse.json("Current password is incorrect", {status:401})
    }

    const hashedPassword = await bcryptjs.hash(newPassword, 10);

    await client.query(
      `UPDATE employee SET password_hash = $1 WHERE emp_id = $2`,
      [hashedPassword, emp_id]
    );

    return NextResponse.json({ message: "Password changed successfully" });
  } catch (error) {
    console.error("Error changing password:", error);
      return NextResponse.json("Internal server error", {status:500})
  } finally {
    client.release();
  }
}
