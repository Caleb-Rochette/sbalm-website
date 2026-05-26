// CRM ONLY
"use client";

const opts = [["SENT","Sent"],["ACCEPTED","Accepted"],["DECLINED","Declined"],["EXPIRED","Expired"]];

export default function QuoteStatusSelect({ id, current }: { id: string; current: string }) {
  return (
    <select defaultValue={current}
      onChange={async (e) => {
        await fetch(`/api/crm/quotes/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: e.target.value }),
        });
        window.location.reload();
      }}
      className="border border-gray-200 rounded px-2 py-1 text-xs focus:outline-none focus:border-brand-orange">
      {opts.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
    </select>
  );
}
