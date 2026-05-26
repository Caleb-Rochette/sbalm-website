// CRM ONLY
"use client";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

const TYPE_OPTS = [["CALL","Call"],["TEXT","Text"],["EMAIL","Email"],["IN_PERSON","In Person"],["NOTE","Note"]];

function NewInteractionForm() {
  const router = useRouter();
  const sp = useSearchParams();
  const preCustomerId = sp.get("customerId") ?? "";
  const preJobId      = sp.get("jobId")      ?? "";

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [customers, setCustomers] = useState<{ id: string; firstName: string; lastName: string }[]>([]);
  const [jobs, setJobs] = useState<{ id: string; jobDate: string; jobTime: string }[]>([]);
  const [form, setForm] = useState({
    customerId: preCustomerId,
    jobId:      preJobId,
    type:       "NOTE",
    summary:    "",
  });

  useEffect(() => {
    fetch("/api/crm/customers?take=200")
      .then(r => r.json())
      .then(d => { if (d.success) setCustomers(d.data.customers); })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!form.customerId) { setJobs([]); return; }
    fetch(`/api/crm/jobs?customerId=${form.customerId}`)
      .then(r => r.json())
      .then(d => {
        if (d.success) setJobs(d.data.jobs.map((j: { id: string; jobDate: string; jobTime: string }) => ({
          id: j.id,
          jobDate: new Date(j.jobDate).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
          jobTime: j.jobTime,
        })));
      })
      .catch(() => {});
  }, [form.customerId]);

  function set(key: string, val: string) {
    setForm(f => ({ ...f, [key]: val }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/crm/interactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, jobId: form.jobId || null }),
      });
      const data = await res.json();
      if (data.success) {
        if (preCustomerId) {
          router.push(`/crm/customers/${preCustomerId}`);
        } else {
          router.push("/crm/dashboard");
        }
      } else {
        setError(data.error ?? "Failed to log interaction.");
        setSaving(false);
      }
    } catch {
      setError("Network error. Please try again.");
      setSaving(false);
    }
  }

  const backHref = preCustomerId ? `/crm/customers/${preCustomerId}` : "/crm/dashboard";

  return (
    <div className="p-6 max-w-xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Link href={backHref} className="text-gray-400 hover:text-gray-600 text-sm">← Back</Link>
        <span className="text-gray-200">/</span>
        <h1 className="font-heading font-extrabold text-2xl text-brand-navy">Log Interaction</h1>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Customer *</label>
            <select value={form.customerId} onChange={e => set("customerId", e.target.value)} required
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-brand-orange">
              <option value="">Select customer…</option>
              {customers.map(c => (
                <option key={c.id} value={c.id}>{c.firstName} {c.lastName}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Type *</label>
            <select value={form.type} onChange={e => set("type", e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-brand-orange">
              {TYPE_OPTS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
            </select>
          </div>

          {jobs.length > 0 && (
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Related Job (optional)</label>
              <select value={form.jobId} onChange={e => set("jobId", e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-brand-orange">
                <option value="">No specific job</option>
                {jobs.map(j => (
                  <option key={j.id} value={j.id}>{j.jobDate} · {j.jobTime}</option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Summary *</label>
            <textarea value={form.summary} onChange={e => set("summary", e.target.value)} required rows={4}
              placeholder="What happened? What was discussed? Any follow-up needed?"
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-brand-orange resize-none" />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={saving}
              className="bg-brand-navy text-white font-bold px-6 py-2.5 rounded-xl hover:bg-brand-navyLight transition-colors disabled:opacity-60">
              {saving ? "Saving…" : "Log Interaction"}
            </button>
            <Link href={backHref}
              className="px-6 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors">
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function NewInteractionPage() {
  return <Suspense><NewInteractionForm /></Suspense>;
}
