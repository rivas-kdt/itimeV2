import pool from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request, ctx: any) {
    const client = await pool.connect();
    try {
        const { id } = await ctx.params;
        const query = `SELECT
        e.emp_id AS "empID",
        e.first_name,
        e.last_name,
        COALESCE(e.role, 'User') AS role,
        e.email,
        g.group_name AS "group",
        COUNT(i.inspection_id) AS inspections
        FROM employee e
        JOIN "group" g ON g.group_id = e.group_id
        LEFT JOIN inspection_v2 i ON i.inspector_id = e.emp_id
        WHERE e.emp_id = $1
        GROUP BY e.emp_id, g.group_name;`;
        const { rows } = await client.query(query, [id]);
        if (rows.length === 0) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }
        return NextResponse.json(rows[0], { status: 200 });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        return NextResponse.json({ error: errorMessage || "Failed to fetch user" }, { status: 500 });
    } finally {
        client.release();
    }
}

export async function PATCH(req: Request, ctx: any) {
    const client = await pool.connect();
    try {
        const { id } = await ctx.params;
        const body = await req.json();
        if (!body) {
            return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
        }
        const fields: string[] = [];
        const values: any[] = [];

        const setText = (col: string, val: any) => {
            values.push(String(val));
            fields.push(`${col} = $${values.length}`);
        }

        if (body.first_name !== undefined) setText("first_name", body.first_name);
        if (body.last_name !== undefined) setText("last_name", body.last_name);
        if (body.email !== undefined) setText("email", body.email);

        if (body.access !== undefined) {
            const a = String(body.access).trim();
            if (a !== "Admin" && a !== "User")
                return NextResponse.json({ error: "Invalid access role" }, { status: 400 });
            values.push(a);
            fields.push(`role = $${values.length}`);
        }

        if (body.group_id !== undefined) {
            values.push(String(body.group_id).trim());
            fields.push(`group_id = $${values.length}::uuid`);
        }

        if (!fields.length) return NextResponse.json({ ok: true });
        values.push(id);

        const query = `UPDATE employee
        SET ${fields.join(", ")}
        WHERE emp_id = $${values.length}
        RETURNING emp_id AS "empID"`;
        const { rows } = await client.query(query, values);
        if (rows.length === 0) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }
        return NextResponse.json(rows[0], { status: 200 });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        return NextResponse.json({ error: errorMessage || "Failed to update user" }, { status: 500 });
    } finally {
        client.release();
    }
}

export async function DELETE(req: Request, ctx: any) {
    const client = await pool.connect();
    try {
        const { id } = await ctx.params;
        const result = await client.query(
            `DELETE FROM employee WHERE emp_id = $1::int`,
            [id],
        );

        if (!result.rowCount) return NextResponse.json({ error: "User not found" }, { status: 404 });

        return NextResponse.json({ ok: true }, { status: 200 });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        return NextResponse.json({ error: errorMessage || "Failed to delete user" }, { status: 500 });
    } finally {
        client.release();
    }
}