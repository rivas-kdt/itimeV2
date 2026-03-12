"use server";

import { cookies } from "next/headers";

export async function createSession(token: string) {
  const cookie = await cookies();
  cookie.set("jwt", token, { secure: true, httpOnly: false });
}

export async function readSession() {
  const cookie = await cookies();
  return cookie.get("jwt")?.value || null;
}

export async function clearSession() {
  const cookie = await cookies();
  cookie.delete("jwt");
}
