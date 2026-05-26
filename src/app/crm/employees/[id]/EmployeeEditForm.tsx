// CRM ONLY
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Employee } from "@prisma/client";

function toDateInput(d: Date | null) {
  if (!d) return "";
  return new Date(d).toISOString().slice(0, 10);
}

export default function EmployeeEditForm({ employee }: { employee: Employee }) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    firstName: employee.firstName,
    lastName:  employee.lastName,
    role:      employee.role,
    phone:     employee.phone     ?? "",
    email:     employee.email     ?? "",
    hireDate:  toDateInput(employee.hireDate),
    notes:     employee.notes     ?? "",
    status:    employee.status,
  });

  function set(key: string, val: string) {
    setForm(f => ({ ...f, [key]: val }));
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    const res = await fetch(`/api/crm/employees/${employee.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, hireDate: form.hireDate || null }),
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
      <h2 className="font-heading font-bold text-brand-navy mb-4">Employee Info</h2>
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
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Role</label>
          <input value={form.role} onChange={e => set("role", e.target.value)} required
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
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Hire Date</label>
          <input type="date" value={form.hireDate} onChange={e => set("hireDate", e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-orange" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Status</label>
          <select value={form.status} onChange={e => set("status", e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-orange">
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
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
    </div>
  );
}
