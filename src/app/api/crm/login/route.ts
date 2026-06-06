import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/crm/db";
import bcrypt from "bcryptjs";
import { encode } from "@auth/core/jwt";
import { SESSION_COOKIE } from "@/auth.config";
import { storePendingSession } from "@/lib/crm/session-store";

export const runtime = "nodejs";

const COOKIE_NAME = SESSION_COOKIE;
const MAX_AGE = 8 * 60 * 60; // 8 hours

// Compared against when the email doesn't exist, so login response timing
// doesn't reveal which emails are valid (anti-enumeration).
const DUMMY_HASH = bcrypt.hashSync("invalid-placeholder", 10);

// In-memory per-IP login throttle: 10 attempts / 15 min.
const loginAttempts = new Map<string, { count: number; resetAt: number }>();
function loginRateLimited(ip: string): boolean {
  const now = Date.now();
  const e = loginAttempts.get(ip);
  if (!e || now > e.resetAt) {
    loginAttempts.set(ip, { count: 1, resetAt: now + 15 * 60 * 1000 });
    return false;
  }
  if (e.count >= 10) return true;
  e.count++;
  return false;
}

async function verifyAndMintToken(email: string, password: string) {
  if (!email || !password) return null;

  const user = await prisma.user.findUnique({ where: { email } });

  // Always run a bcrypt compare (dummy hash when the user is absent) so the
  // response time doesn't reveal whether an email exists.
  const valid = await bcrypt.compare(password, user?.hashedPassword ?? DUMMY_HASH);

  if (!user) return null;
  if (user.lockedUntil && user.lockedUntil > new Date()) return null;
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

// Native form POST → redirect (no JavaScript required in the browser)
export async function POST(req: NextRequest) {
  try {
    const siteUrl = process.env.AUTH_URL ?? process.env.NEXTAUTH_URL ?? "https://sirboxalotmovers.com";
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      req.headers.get("x-real-ip") ??
      "unknown";
    if (loginRateLimited(ip)) {
      return NextResponse.redirect(new URL("/crm/login?error=1", siteUrl), { status: 303 });
    }

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

    const token = await verifyAndMintToken(email, password);

    if (!token) {
      return NextResponse.redirect(new URL("/crm/login?error=1", siteUrl), { status: 303 });
    }

    // Redirect to the session endpoint which sets the cookie on a real GET response.
    // This avoids Vivaldi's bounce-tracking protection blocking cookies on POST→303 chains.
    const nonce = storePendingSession(token);
    return NextResponse.redirect(new URL(`/api/crm/session?n=${nonce}`, siteUrl), { status: 303 });
  } catch (err) {
    console.error("[crm/login] error:", err);
    const siteUrl = process.env.AUTH_URL ?? process.env.NEXTAUTH_URL ?? "https://sirboxalotmovers.com";
    return NextResponse.redirect(new URL("/crm/login?error=1", siteUrl), { status: 303 });
  }
}
