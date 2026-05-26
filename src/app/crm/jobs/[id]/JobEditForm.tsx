// CRM ONLY
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Job } from "@prisma/client";

const STATUS_OPTS  = [["SCHEDULED","Scheduled"],["IN_PROGRESS","In Progress"],["COMPLETED","Completed"],["CANCELLED","Cancelled"],["NO_SHOW","No Show"]];
const SERVICE_OPTS = [["LOADING_UNLOADING","Loading & Unloading"],["PACKING","Packing"],["BOTH","Both"]];

function toDateInput(d: Date) {
  return new Date(d).toISOString().slice(0, 10);
}

export default function JobEditForm({ job }: { job: Job }) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    status:             job.status,
    jobDate:            toDateInput(job.jobDate),
    jobTime:            job.jobTime,
    crewSize:           String(job.crewSize),
    serviceType:        job.serviceType,
    originAddress:      job.originAddress,
    destinationAddress: job.destinationAddress,
    estimatedHours:     String(job.estimatedHours),
    actualHours:        job.actualHours ? String(job.actualHours) : "",
    pricePerHour:       String(job.pricePerHour),
    totalCharged:       job.totalCharged ? String(job.totalCharged) : "",
    truckRentalCompany: job.truckRentalCompany ?? "",
    notes:              job.notes ?? "",
  });

  function set(key: string, val: string) {
    setForm(f => ({ ...f, [key]: val }));
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    const res = await fetch(`/api/crm/jobs/${job.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        crewSize:       Number(form.crewSize),
        estimatedHours: Number(form.estimatedHours),
        actualHours:    form.actualHours    ? Number(form.actualHours)    : null,
        pricePerHour:   Number(form.pricePerHour),
        totalCharged:   form.totalCharged   ? Number(form.totalCharged)   : null,
        truckRentalCompany: form.truckRentalCompany || null,
        notes: form.notes || null,
      }),
    });
    const data = await res.json();
    if (data.success) {
      router.refresh();
    } else {
      setError(data.error ?? "Save failed.");
    }
    setSaving(false);
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
      <h2 className="font-heading font-bold text-brand-navy mb-4">Edit Job</h2>
      <form onSubmit={save} className="space-y-3">
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Status</label>
          <select value={form.status} onChange={e => set("status", e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-orange">
            {STATUS_OPTS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Date</label>
          <input type="date" value={form.jobDate} onChange={e => set("jobDate", e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-orange" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Time</label>
          <input value={form.jobTime} onChange={e => set("jobTime", e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-orange" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Crew Size</label>
          <select value={form.crewSize} onChange={e => set("crewSize", e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-orange">
            <option value="2">2-Man</option>
            <option value="3">3-Man</option>
            <option value="4">4-Man</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Service Type</label>
          <select value={form.serviceType} onChange={e => set("serviceType", e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-orange">
            {SERVICE_OPTS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Origin</label>
          <input value={form.originAddress} onChange={e => set("originAddress", e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-orange" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Destination</label>
          <input value={form.destinationAddress} onChange={e => set("destinationAddress", e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-orange" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Est. Hours</label>
          <input type="number" min="0.5" step="0.5" value={form.estimatedHours} onChange={e => set("estimatedHours", e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-orange" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Actual Hours</label>
          <input type="number" min="0" step="0.5" value={form.actualHours} onChange={e => set("actualHours", e.target.value)}
            placeholder="After job completes"
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-orange" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Rate / Hr ($)</label>
          <input type="number" min="1" value={form.pricePerHour} onChange={e => set("pricePerHour", e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-orange" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Total Charged ($)</label>
          <input type="number" min="0" value={form.totalCharged} onChange={e => set("totalCharged", e.target.value)}
            placeholder="After job completes"
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-orange" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Truck Rental Co.</label>
          <input value={form.truckRentalCompany} onChange={e => set("truckRentalCompany", e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-orange" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Notes</label>
          <textarea value={form.notes} onChange={e => set("notes", e.target.value)} rows={2}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-orange resize-none" />
        </div>

        {error && <p className="text-red-500 text-xs">{error}</p>}

        <button type="submit" disabled={saving}
          className="w-full bg-brand-navy text-white font-bold py-2.5 rounded-xl hover:bg-brand-navyLight transition-colors disabled:opacity-60 text-sm">
          {saving ? "Saving…" : "Save Changes"}
        </button>
      </form>
    </div>
  );
}
