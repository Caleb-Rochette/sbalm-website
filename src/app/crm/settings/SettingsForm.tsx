// CRM ONLY
"use client";
import { useState } from "react";
import type { BusinessSettings } from "@prisma/client";

export default function SettingsForm({ settings }: { settings: BusinessSettings }) {
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    rate2ManCrew: String(settings.rate2ManCrew),
    rate3ManCrew: String(settings.rate3ManCrew),
    minimumHours: String(settings.minimumHours),
  });

  function set(key: string, val: string) {
    setForm(f => ({ ...f, [key]: val }));
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    setError("");
    const res = await fetch("/api/crm/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        rate2ManCrew: Number(form.rate2ManCrew),
        rate3ManCrew: Number(form.rate3ManCrew),
        minimumHours: Number(form.minimumHours),
      }),
    });
    const data = await res.json();
    if (data.success) {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } else {
      setError(data.error ?? "Save failed.");
    }
    setSaving(false);
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <form onSubmit={save} className="space-y-5">
        <div>
          <h2 className="font-heading font-bold text-brand-navy mb-4">Hourly Rates</h2>
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">2-Man Crew Rate ($/hr)</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
                <input type="number" min="1" value={form.rate2ManCrew} onChange={e => set("rate2ManCrew", e.target.value)} required
                  className="w-full border border-gray-200 rounded-lg pl-7 pr-3 py-2.5 text-sm focus:outline-none focus:border-brand-orange" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">3-Man Crew Rate ($/hr)</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
                <input type="number" min="1" value={form.rate3ManCrew} onChange={e => set("rate3ManCrew", e.target.value)} required
                  className="w-full border border-gray-200 rounded-lg pl-7 pr-3 py-2.5 text-sm focus:outline-none focus:border-brand-orange" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Minimum Hours</label>
              <input type="number" min="1" step="0.5" value={form.minimumHours} onChange={e => set("minimumHours", e.target.value)} required
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-brand-orange" />
            </div>
          </div>
        </div>

        {/* Pricing preview */}
        <div className="bg-gray-50 rounded-lg p-4 text-sm">
          <p className="font-semibold text-gray-700 mb-2">Pricing Preview</p>
          <div className="space-y-1 text-gray-600">
            <p>2-man crew, {form.minimumHours}hr minimum: <span className="font-semibold">${(Number(form.rate2ManCrew) * Number(form.minimumHours)).toFixed(2)}</span></p>
            <p>3-man crew, {form.minimumHours}hr minimum: <span className="font-semibold">${(Number(form.rate3ManCrew) * Number(form.minimumHours)).toFixed(2)}</span></p>
          </div>
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}
        {saved && <p className="text-green-600 text-sm font-semibold">Settings saved.</p>}

        <button type="submit" disabled={saving}
          className="w-full bg-brand-navy text-white font-bold py-3 rounded-xl hover:bg-brand-navyLight transition-colors disabled:opacity-60">
          {saving ? "Saving…" : "Save Settings"}
        </button>
      </form>
    </div>
  );
}
