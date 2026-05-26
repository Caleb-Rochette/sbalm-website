// CRM ONLY
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Customer } from "@prisma/client";

const STATUS_OPTS  = [["LEAD","Lead"],["BOOKED","Booked"],["COMPLETED","Completed"],["CANCELLED","Cancelled"],["NO_SHOW","No Show"]];
const SOURCE_OPTS  = [["WEBSITE_FORM","Website Form"],["WEBSITE_CHAT","Website Chat"],["PHONE_CALL","Phone Call"],["REFERRAL","Referral"],["GOOGLE","Google"],["OTHER","Other"]];

export default function CustomerEditForm({ customer }: { customer: Customer }) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    firstName: customer.firstName,
    lastName:  customer.lastName,
    email:     customer.email    ?? "",
    phone:     customer.phone    ?? "",
    address:   customer.address  ?? "",
    notes:     customer.notes    ?? "",
    status:    customer.status,
    source:    customer.source,
  });

  function set(key: string, val: string) {
    setForm(f => ({ ...f, [key]: val }));
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    const res = await fetch(`/api/crm/customers/${customer.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (data.success) {
      router.refresh();
    } else {
      setError(data.error ?? "Save failed.");
    }
    setSaving(false);
  }

  async function deleteCustomer() {
    if (!confirm(`Delete ${customer.firstName} ${customer.lastName}? This cannot be undone.`)) return;
    setDeleting(true);
    setError("");
    const res = await fetch(`/api/crm/customers/${customer.id}`, { method: "DELETE" });
    const data = await res.json();
    if (data.success) {
      router.push("/crm/customers");
    } else {
      setError(data.error ?? "Delete failed.");
      setDeleting(false);
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
      <h2 className="font-heading font-bold text-brand-navy mb-4">Customer Info</h2>
      <form onSubmit={save} className="space-y-3">
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">First Name</label>
          <input value={form.firstName} onChange={e => set("firstName", e.target.value)} required
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-orange" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Last Name</label>
          <input value={form.lastName} onChange={e => set("lastName", e.target.value)} required
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-orange" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Phone</label>
          <input type="tel" value={form.phone} onChange={e => set("phone", e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-orange" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Email</label>
          <input type="email" value={form.email} onChange={e => set("email", e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-orange" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Address</label>
          <input value={form.address} onChange={e => set("address", e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-orange" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Status</label>
          <select value={form.status} onChange={e => set("status", e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-orange">
            {STATUS_OPTS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Source</label>
          <select value={form.source} onChange={e => set("source", e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-orange">
            {SOURCE_OPTS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Notes</label>
          <textarea value={form.notes} onChange={e => set("notes", e.target.value)} rows={3}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-orange resize-none" />
        </div>

        {error && <p className="text-red-500 text-xs">{error}</p>}

        <button type="submit" disabled={saving}
          className="w-full bg-brand-navy text-white font-bold py-2.5 rounded-xl hover:bg-brand-navyLight transition-colors disabled:opacity-60 text-sm">
          {saving ? "Saving…" : "Save Changes"}
        </button>
      </form>

      <button onClick={deleteCustomer} disabled={deleting}
        className="w-full mt-3 text-red-500 border border-red-100 font-semibold py-2 rounded-xl hover:bg-red-50 transition-colors text-sm disabled:opacity-60">
        {deleting ? "Deleting…" : "Delete Customer"}
      </button>
    </div>
  );
}
