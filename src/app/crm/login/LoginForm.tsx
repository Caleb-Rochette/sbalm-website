"use client";
import { useState } from "react";

export default function LoginForm() {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(false);
    setLoading(true);

    const form = e.currentTarget;
    const email = (form.elements.namedItem("email") as HTMLInputElement).value;
    const password = (form.elements.namedItem("password") as HTMLInputElement).value;

    const res = await fetch("/api/crm/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (res.ok) {
      window.location.href = "/crm/dashboard";
    } else {
      setError(true);
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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
      {error && (
        <p className="text-red-500 text-sm">Invalid email or password.</p>
      )}
      <button type="submit" disabled={loading}
        className="w-full bg-brand-orange text-white font-bold py-3 rounded-xl hover:bg-brand-ember transition-colors text-sm disabled:opacity-60">
        {loading ? "Signing in…" : "Sign In"}
      </button>
    </form>
  );
}
