// CRM ONLY
import { signIn } from "@/auth";
import { AuthError } from "next-auth";
import { redirect } from "next/navigation";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Login — Sir Box a Lot CRM" };

async function login(formData: FormData) {
  "use server";
  try {
    await signIn("credentials", {
      email:      formData.get("email")    as string,
      password:   formData.get("password") as string,
      redirectTo: "/crm/dashboard",
    });
  } catch (e) {
    if (e instanceof AuthError) {
      redirect("/crm/login?error=1");
    }
    throw e; // re-throw the successful redirect
  }
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const sp = await searchParams;
  const hasError = !!sp?.error;

  return (
    <div className="min-h-screen bg-brand-navy flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="font-heading text-3xl font-extrabold text-white">Sir Box a Lot</h1>
          <p className="text-brand-mist mt-1 text-sm">Staff Portal — Authorized Access Only</p>
        </div>
        <div className="bg-white rounded-2xl p-8 shadow-2xl">
          <h2 className="font-heading font-bold text-brand-navy text-xl mb-6">Sign In</h2>
          <form action={login} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Email</label>
              <input type="email" name="email" required autoComplete="email"
                defaultValue="daryl@sirboxalotmovers.com"
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-brand-orange" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Password</label>
              <input type="password" name="password" required autoComplete="current-password"
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-brand-orange" />
            </div>
            {hasError && (
              <p className="text-red-500 text-sm">Invalid email or password.</p>
            )}
            <button type="submit"
              className="w-full bg-brand-orange text-white font-bold py-3 rounded-xl hover:bg-brand-ember transition-colors text-sm">
              Sign In
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
