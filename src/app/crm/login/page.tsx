// CRM ONLY
import type { Metadata } from "next";
import GoogleButton from "./GoogleButton";

export const metadata: Metadata = { title: "Login — Sir Box a Lot CRM" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const sp = await searchParams;
  const error = sp?.error;

  return (
    <div className="min-h-screen bg-brand-navy flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="font-heading text-3xl font-extrabold text-white">Sir Box a Lot</h1>
          <p className="text-brand-mist mt-1 text-sm">Staff Portal — Authorized Access Only</p>
        </div>
        <div className="bg-white rounded-2xl p-8 shadow-2xl">
          <h2 className="font-heading font-bold text-brand-navy text-xl mb-6">Sign In</h2>
          <form method="POST" action="/api/crm/login" className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Email</label>
              <input type="email" name="email" required autoComplete="email"
className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-brand-orange" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Password</label>
              <input type="password" name="password" required autoComplete="current-password"
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-brand-orange" />
            </div>
            {error && (
              <p className="text-red-500 text-sm">
                {error === "forbidden"
                  ? "That account doesn't have back-office access."
                  : "Invalid email or password."}
              </p>
            )}
            <button type="submit"
              className="w-full bg-brand-orange text-white font-bold py-3 rounded-xl hover:bg-brand-ember transition-colors text-sm">
              Sign In
            </button>
          </form>

          <div className="relative my-5">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200" /></div>
            <div className="relative flex justify-center"><span className="bg-white px-2 text-xs text-gray-400">or</span></div>
          </div>

          <GoogleButton />
          <p className="text-center text-[11px] text-gray-400 mt-3">Google sign-in is for field crew &amp; customers.</p>
        </div>
      </div>
    </div>
  );
}
