// CRM ONLY
"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";

const SERVICE_OPTS = [["LOADING_UNLOADING","Loading & Unloading"],["PACKING","Packing"],["BOTH","Both"]];
const STATUS_OPTS  = [["SCHEDULED","Scheduled"],["IN_PROGRESS","In Progress"],["COMPLETED","Completed"],["CANCELLED","Cancelled"],["NO_SHOW","No Show"]];

function today() {
  return new Date().toISOString().slice(0, 10);
}

function NewJobForm() {
  const router = useRouter();
  const sp = useSearchParams();
  const preCustomerId = sp.get("customerId") ?? "";

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [customers, setCustomers] = useState<{ id: string; firstName: string; lastName: string }[]>([]);
  const [form, setForm] = useState({
    customerId: preCustomerId,
    jobDate: today(),
    jobTime: "9:00 AM",
    crewSize: "2",
    serviceType: "LOADING_UNLOADING",
    originAddress: "",
    destinationAddress: "",
    estimatedHours: "3",
    pricePerHour: "125",
    truckRentalCompany: "",
    notes: "",
    status: "SCHEDULED",
  });

  useEffect(() => {
    fetch("/api/crm/customers?take=200")
      .then(r => r.json())
      .then(d => { if (d.success) setCustomers(d.data.customers); })
      .catch(() => {});
  }, []);

  function set(key: string, val: string) {
    setForm(f => ({ ...f, [key]: val }));
  }

  // Auto-update price when crew size changes
  function setCrew(val: string) {
    const price = val === "3" ? "175" : "125";
    setForm(f => ({ ...f, crewSize: val, pricePerHour: price }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/crm/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        router.push(`/crm/jobs/${data.data.id}`);
      } else {
        setError(data.error ?? "Failed to create job.");
        setSaving(false);
      }
    } catch {
      setError("Network error. Please try again.");
      setSaving(false);
    }
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/crm/jobs" className="text-gray-400 hover:text-gray-600 text-sm">← Jobs</Link>
        <span className="text-gray-200">/</span>
        <h1 className="font-heading font-extrabold text-2xl text-brand-navy">New Job</h1>
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

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Job Date *</label>
              <input type="date" value={form.jobDate} onChange={e => set("jobDate", e.target.value)} required
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-brand-orange" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Time *</label>
              <input value={form.jobTime} onChange={e => set("jobTime", e.target.value)} placeholder="9:00 AM" required
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-brand-orange" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Crew Size *</label>
              <select value={form.crewSize} onChange={e => setCrew(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-brand-orange">
                <option value="2">2-Man Crew</option>
                <option value="3">3-Man Crew</option>
                <option value="4">4-Man Crew</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Service Type *</label>
              <select value={form.serviceType} onChange={e => set("serviceType", e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-brand-orange">
                {SERVICE_OPTS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Origin Address *</label>
            <input value={form.originAddress} onChange={e => set("originAddress", e.target.value)} required
              placeholder="123 Main St, City, TX 75001"
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-brand-orange" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Destination Address *</label>
            <input value={form.destinationAddress} onChange={e => set("destinationAddress", e.target.value)} required
              placeholder="456 Oak Ave, City, TX 75002"
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-brand-orange" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Est. Hours *</label>
              <input type="number" min="1" step="0.5" value={form.estimatedHours} onChange={e => set("estimatedHours", e.target.value)} required
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-brand-orange" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Rate / Hour *</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
                <input type="number" min="1" value={form.pricePerHour} onChange={e => set("pricePerHour", e.target.value)} required
                  className="w-full border border-gray-200 rounded-lg pl-7 pr-3 py-2.5 text-sm focus:outline-none focus:border-brand-orange" />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Truck Rental Company</label>
            <input value={form.truckRentalCompany} onChange={e => set("truckRentalCompany", e.target.value)}
              placeholder="U-Haul, Penske, Budget…"
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-brand-orange" />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Status</label>
            <select value={form.status} onChange={e => set("status", e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-brand-orange">
              {STATUS_OPTS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Notes</label>
            <textarea value={form.notes} onChange={e => set("notes", e.target.value)} rows={3}
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-brand-orange resize-none" />
          </div>

          {/* Estimate preview */}
          {form.estimatedHours && form.pricePerHour && (
            <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-600">
              Estimated total: <span className="font-bold text-brand-navy">
                ${(parseFloat(form.estimatedHours) * parseFloat(form.pricePerHour)).toFixed(2)}
              </span>
              {" "}({form.estimatedHours} hrs @ ${form.pricePerHour}/hr)
            </div>
          )}

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={saving}
              className="bg-brand-navy text-white font-bold px-6 py-2.5 rounded-xl hover:bg-brand-navyLight transition-colors disabled:opacity-60">
              {saving ? "Saving…" : "Create Job"}
            </button>
            <Link href="/crm/jobs"
              className="px-6 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors">
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function NewJobPage() {
  return <Suspense><NewJobForm /></Suspense>;
}
