// CRM ONLY
import type { Metadata } from "next";
import { signIn } from "@/auth";

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

          <form
            action={async () => {
              "use server";
              await signIn("google", { redirectTo: "/crm/dashboard" });
            }}
          >
            <button type="submit"
              className="w-full flex items-center justify-center gap-2 border border-gray-300 rounded-xl py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
              <svg width="16" height="16" viewBox="0 0 48 48" aria-hidden="true">
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
              </svg>
              Continue with Google
            </button>
          </form>
          <p className="text-center text-[11px] text-gray-400 mt-3">Google sign-in is for field crew &amp; customers.</p>
        </div>
      </div>
    </div>
  );
}
