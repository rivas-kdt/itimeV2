/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { SignJWT } from "jose";
import { jwtDecode } from "jwt-decode";
// import { AuthUser } from "@/types/auth";

export interface JwtPayload {
  iat: number;
  exp: number;
  user: any;
}

const key = new TextEncoder().encode(process.env.JWT_SECRET_KEY);

export async function encrypt(payload: any): Promise<string> {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("3d")
    .sign(key);
}

export async function decrypt(token: string): Promise<JwtPayload | null> {
  try {
    return jwtDecode<JwtPayload>(token);
  } catch (e) {
    console.error("JWT decode error:", e);
    return null;
  }
}
