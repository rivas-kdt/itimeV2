import { NextResponse } from "next/server";

const LOCALE_COOKIE = "locale";
const MAX_AGE = 60 * 60 * 24 * 365; // 1 year

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const locale = (body?.locale ?? "").toString();
    if (locale !== "en" && locale !== "ja") {
      return NextResponse.json({ error: "Invalid locale" }, { status: 400 });
    }
    const res = NextResponse.json({ ok: true, locale });
    res.cookies.set(LOCALE_COOKIE, locale, {
      path: "/",
      maxAge: MAX_AGE,
      sameSite: "lax",
      httpOnly: false, // so client can read if needed
      secure: process.env.NODE_ENV === "production",
    });
    return res;
  } catch {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }
}
