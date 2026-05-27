// Intentionally outside /api/crm/* so the NextAuth auth() middleware wrapper
// cannot intercept this response and re-set the session cookie.
import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE } from "@/auth.config";

export const runtime = "nodejs";

const secure = process.env.NODE_ENV === "production";

export async function GET(req: NextRequest) {
  // Use the actual host from the request so this works on both dev.sirboxalotmovers.com
  // and sirboxalotmovers.com. proxy.php sets X-Forwarded-Host from $_SERVER['HTTP_HOST'].
  const host = req.headers.get("x-forwarded-host") ?? req.headers.get("host") ?? "sirboxalotmovers.com";
  const loginUrl = `https://${host}/crm/login`;
  const res = NextResponse.redirect(loginUrl, { status: 303 });
  res.cookies.set(SESSION_COOKIE, "", {
    expires: new Date(0),
    path: "/",
    httpOnly: true,
    secure,
    sameSite: "lax",
  });
  res.headers.set("Cache-Control", "no-store");
  return res;
}
