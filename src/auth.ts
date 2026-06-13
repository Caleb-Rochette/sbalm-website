// CRM ONLY — full auth config (Node.js runtime only — NOT used in middleware)
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { authConfig } from "@/auth.config";
import { prisma } from "@/lib/crm/db";
import bcrypt from "bcryptjs";
import type { UserRole } from "@prisma/client";

// Compared against when the email doesn't exist, so authorize() timing doesn't
// reveal which emails are valid (anti-enumeration).
const DUMMY_HASH = bcrypt.hashSync("invalid-placeholder", 10);

declare module "next-auth" {
  interface User { role: UserRole; }
  interface Session { user: { id: string; email: string; name: string; role: UserRole; }; }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  callbacks: {
    ...authConfig.callbacks,
    // Node-runtime jwt (has Prisma): on Google sign-in, upsert the user and
    // attach our DB id + role. Credentials sign-ins already carry both. New
    // Google users default to CUSTOMER (least privilege) until promoted.
    async jwt({ token, user, account }) {
      if (account?.provider === "google" && user?.email) {
        const email = user.email.toLowerCase();
        const dbUser = await prisma.user.upsert({
          where:  { email },
          update: { name: user.name ?? undefined, lastLoginAt: new Date() },
          create: { email, name: user.name ?? email, role: "CUSTOMER" },
        });
        token.id = dbUser.id;
        token.role = dbUser.role;
      } else if (user) {
        token.id = (user as { id: string }).id;
        token.role = (user as { role: UserRole }).role;
      }
      return token;
    },
  },
  providers: [
    // Google OAuth (field crew + customer portal). Only enabled when creds are
    // configured, so the app still runs without them.
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [Google({ clientId: process.env.GOOGLE_CLIENT_ID, clientSecret: process.env.GOOGLE_CLIENT_SECRET })]
      : []),
    Credentials({
      credentials: {
        email:    { label: "Email",    type: "email"    },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const email    = String(credentials.email).toLowerCase().trim();
        const password = String(credentials.password);

        const user = await prisma.user.findUnique({ where: { email } });

        // Constant-time: always compare (dummy hash when user absent) so timing
        // doesn't reveal which emails are valid.
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

        return { id: user.id, email: user.email, name: user.name, role: user.role };
      },
    }),
  ],
});
