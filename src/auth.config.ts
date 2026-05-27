// CRM ONLY — edge-compatible auth config (no Node.js-only imports)
import type { NextAuthConfig } from "next-auth";

// Plain name with Secure attribute — avoids __Secure- prefix edge/Node.js mismatch
const secure = process.env.NODE_ENV === "production";
export const SESSION_COOKIE = "sbal_session";

export const authConfig: NextAuthConfig = {
  pages: { signIn: "/crm/login" },
  session: { strategy: "jwt", maxAge: 8 * 60 * 60 },
  cookies: {
    sessionToken: { name: SESSION_COOKIE, options: { httpOnly: true, sameSite: "lax", path: "/", secure } },
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn  = !!auth?.user;
      const isLoginPage = nextUrl.pathname === "/crm/login";
      if (isLoginPage) return true;
      return isLoggedIn;
    },
    jwt({ token, user }) {
      if (user) {
        token.id   = user.id!;
        token.role = (user as { role: string }).role;
      }
      return token;
    },
    session({ session, token }) {
      session.user.id   = token.id as string;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      session.user.role = token.role as any;
      return session;
    },
  },
  providers: [],
  trustHost: true,
};
