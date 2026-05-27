import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/crm/db";
import bcrypt from "bcryptjs";
import { encode } from "@auth/core/jwt";
import { SESSION_COOKIE } from "@/auth.config";

export const runtime = "nodejs";

const authUrl = process.env.AUTH_URL ?? process.env.NEXTAUTH_URL ?? "";
const useSecureCookies = authUrl.startsWith("https://");
const COOKIE_NAME = SESSION_COOKIE;
const MAX_AGE = 8 * 60 * 60; // 8 hours

async function verifyAndMintToken(email: string, password: string) {
  if (!email || !password) return null;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return null;

  if (user.lockedUntil && user.lockedUntil > new Date()) return null;

  const valid = await bcrypt.compare(password, user.hashedPassword);
  if (!valid) {
    const attempts = user.failedLoginAttempts + 1;
    await prisma.user.update({
      where: { id: user.id },
      data: {
        failedLoginAttempts: attempts,
        lockedUntil: attempts >= 5 ? new Date(Date.now() + 15 * 60 * 1000) : null,
      },
    });
    return null;
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { failedLoginAttempts: 0, lockedUntil: null, lastLoginAt: new Date() },
  });

  const secret = process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET!;
  return encode({
    token: {
      sub: user.id,
      name: user.name,
      email: user.email,
      picture: null,
      id: user.id,
      role: user.role,
    },
    secret,
    maxAge: MAX_AGE,
    salt: COOKIE_NAME,
  });
}

function setSessionCookie(response: NextResponse, token: string) {
  response.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: useSecureCookies,
    sameSite: "lax",
    maxAge: MAX_AGE,
    path: "/",
  });
}

// Native form POST → redirect (no JavaScript required in the browser)
export async function POST(req: NextRequest) {
  try {
    const ct = req.headers.get("content-type") ?? "";

    let email = "";
    let password = "";

    if (ct.includes("application/json")) {
      const body = await req.json().catch(() => ({}));
      email = String(body.email ?? "").toLowerCase().trim();
      password = String(body.password ?? "");
    } else {
      // application/x-www-form-urlencoded (native HTML form)
      const formData = await req.formData();
      email = String(formData.get("email") ?? "").toLowerCase().trim();
      password = String(formData.get("password") ?? "");
    }

    // Use the public site URL so redirects work through the nginx proxy
    const siteUrl = process.env.AUTH_URL ?? process.env.NEXTAUTH_URL ?? "https://sirboxalotmovers.com";
    const token = await verifyAndMintToken(email, password);

    if (!token) {
      return NextResponse.redirect(new URL("/crm/login?error=1", siteUrl), { status: 303 });
    }

    const response = NextResponse.redirect(new URL("/crm/dashboard", siteUrl), { status: 303 });
    setSessionCookie(response, token);
    return response;
  } catch (err) {
    console.error("[crm/login] error:", err);
    const siteUrl = process.env.AUTH_URL ?? process.env.NEXTAUTH_URL ?? "https://sirboxalotmovers.com";
    return NextResponse.redirect(new URL("/crm/login?error=1", siteUrl), { status: 303 });
  }
}
