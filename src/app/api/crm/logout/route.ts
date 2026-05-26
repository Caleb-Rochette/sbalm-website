import { NextResponse } from "next/server";
import { COOKIE } from "@/lib/auth-crm";

export const runtime = "nodejs";

export async function POST() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE, "", { maxAge: 0, path: "/" });
  return res;
}
