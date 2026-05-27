import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/crm/db";
import bcrypt from "bcryptjs";
import { encode } from "@auth/core/jwt";

export const runtime = "nodejs";

// Match the cookie name NextAuth v5 uses — derived from NEXTAUTH_URL protocol
const authUrl = process.env.AUTH_URL ?? process.env.NEXTAUTH_URL ?? "";
const useSecureCookies = authUrl.startsWith("https://");
const COOKIE_NAME = useSecureCookies ? "__Secure-authjs.session-token" : "authjs.session-token";
const MAX_AGE = 8 * 60 * 60; // 8 hours

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const email = String(body.email ?? "").toLowerCase().trim();
    const password = String(body.password ?? "");

    if (!email || !password) {
      return NextResponse.json({ error: "Invalid credentials." }, { status: 401 });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json({ error: "Invalid credentials." }, { status: 401 });
    }

    if (user.lockedUntil && user.lockedUntil > new Date()) {
      return NextResponse.json({ error: "Account locked. Try again later." }, { status: 401 });
    }

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
      return NextResponse.json({ error: "Invalid credentials." }, { status: 401 });
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { failedLoginAttempts: 0, lockedUntil: null, lastLoginAt: new Date() },
    });

    const secret = process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET!;

    const token = await encode({
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

    const response = NextResponse.json({ ok: true });
    response.cookies.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: useSecureCookies,
      sameSite: "lax",
      maxAge: MAX_AGE,
      path: "/",
    });
    return response;
  } catch (err) {
    console.error("[crm/login] error:", err);
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}
