// CRM ONLY — edge-compatible auth config (no Node.js-only imports)
import type { NextAuthConfig } from "next-auth";

export const authConfig: NextAuthConfig = {
  pages: { signIn: "/crm/login" },
  session: { strategy: "jwt", maxAge: 8 * 60 * 60 },
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
  // Plain cookie names — __Host-/__Secure- prefixes break through the nginx→Apache→PHP proxy chain
  cookies: {
    sessionToken: { name: "sbal.session",  options: { httpOnly: true,  sameSite: "lax", path: "/", secure: true } },
    callbackUrl:  { name: "sbal.callback", options: { httpOnly: true,  sameSite: "lax", path: "/" } },
    csrfToken:    { name: "sbal.csrf",     options: { httpOnly: true,  sameSite: "lax", path: "/" } },
  },
};
