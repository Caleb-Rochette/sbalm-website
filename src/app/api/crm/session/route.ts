import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE } from "@/auth.config";
import { consumePendingSession } from "@/lib/crm/session-store";

export const runtime = "nodejs";

const authUrl = process.env.AUTH_URL ?? process.env.NEXTAUTH_URL ?? "";
const useSecureCookies = authUrl.startsWith("https://");
const MAX_AGE = 8 * 60 * 60;

export async function GET(req: NextRequest) {
  const nonce = req.nextUrl.searchParams.get("n") ?? "";
  const siteUrl = process.env.AUTH_URL ?? process.env.NEXTAUTH_URL ?? "https://sirboxalotmovers.com";

  const token = consumePendingSession(nonce);
  if (!token) {
    return NextResponse.redirect(new URL("/crm/login?error=1", siteUrl), { status: 303 });
  }

  // Return a real 200 HTML page so the cookie is set on a non-redirect GET response.
  // This avoids bounce-tracking heuristics in Vivaldi and similar privacy browsers
  // that refuse cookies set during a POST→redirect chain.
  const html = `<!DOCTYPE html><html><head><meta http-equiv="refresh" content="0;url=/crm/dashboard"><title>Signing in…</title></head><body></body></html>`;
  const res = new NextResponse(html, {
    status: 200,
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
  res.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: useSecureCookies,
    sameSite: "lax",
    maxAge: MAX_AGE,
    path: "/",
  });
  return res;
}
