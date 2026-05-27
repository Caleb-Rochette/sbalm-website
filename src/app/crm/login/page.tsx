// CRM ONLY
import type { Metadata } from "next";
import LoginForm from "./LoginForm";

export const metadata: Metadata = { title: "Login — Sir Box a Lot CRM" };

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-brand-navy flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="font-heading text-3xl font-extrabold text-white">Sir Box a Lot</h1>
          <p className="text-brand-mist mt-1 text-sm">Staff Portal — Authorized Access Only</p>
        </div>
        <div className="bg-white rounded-2xl p-8 shadow-2xl">
          <h2 className="font-heading font-bold text-brand-navy text-xl mb-6">Sign In</h2>
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
