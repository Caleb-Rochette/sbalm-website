// CRM ONLY — edge-compatible middleware (no Node.js crypto imports)
import NextAuth from "next-auth";
import { authConfig } from "@/auth.config";
import { NextResponse } from "next/server";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isAuthenticated = !!req.auth;

  if (pathname === "/crm/login" || pathname === "/api/crm/login" || pathname === "/api/crm/session" || pathname === "/api/crm/logout") return NextResponse.next();

  if (!isAuthenticated) {
    if (pathname.startsWith("/api/crm")) {
      return NextResponse.json({ success: false, error: "Unauthorized." }, { status: 401 });
    }
    return NextResponse.redirect(new URL("/crm/login", req.url));
  }

  // Back-office (/crm, /api/crm) is ADMIN/STAFF only — field crew and customers
  // who sign in via Google are kept out (their views come in later stages).
  const role = req.auth?.user?.role;
  if (role !== "ADMIN" && role !== "STAFF") {
    if (pathname.startsWith("/api/crm")) {
      return NextResponse.json({ success: false, error: "Forbidden." }, { status: 403 });
    }
    return NextResponse.redirect(new URL("/crm/login?error=forbidden", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/crm/:path*", "/api/crm/:path*"],
};
