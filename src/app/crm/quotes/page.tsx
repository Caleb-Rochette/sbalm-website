// CRM ONLY
import { auth } from "@/auth";
import { prisma } from "@/lib/crm/db";
import Link from "next/link";
import { StatusBadge } from "@/components/crm/StatusBadge";
import { QUOTE_STATUS_LABELS, SERVICE_LABELS } from "@/lib/crm/utils";
import QuoteStatusSelect from "./QuoteStatusSelect";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Quotes — Sir Box a Lot CRM" };
export const dynamic = "force-dynamic";

function fmtDate(d: Date) {
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}
function fmtMoney(n: number) {
  return `$${n.toFixed(2)}`;
}

export default async function QuotesPage({ searchParams }: { searchParams: Promise<Record<string, string>> }) {
  await auth();
  const sp = await searchParams;
  const status = sp.status ?? "";
  const page   = Math.max(1, parseInt(sp.page ?? "1"));
  const take   = 25;

  const where = status ? { status: status as never } : {};

  const [quotes, total] = await Promise.all([
    prisma.quote.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * take,
      take,
      include: { customer: { select: { id: true, firstName: true, lastName: true } } },
    }),
    prisma.quote.count({ where }),
  ]);

  const pages = Math.ceil(total / take);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-heading font-extrabold text-2xl text-brand-navy">Quotes</h1>
          <p className="text-gray-400 text-sm mt-0.5">{total} total</p>
        </div>
        <Link href="/crm/quotes/new"
          className="bg-brand-navy text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-brand-navyLight transition-colors">
          + New Quote
        </Link>
      </div>

      <form method="get" className="flex flex-wrap gap-3 mb-6">
        <select name="status" defaultValue={status}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-orange">
          <option value="">All Statuses</option>
          {Object.entries(QUOTE_STATUS_LABELS).map(([v, l]) => (
            <option key={v} value={v}>{l}</option>
          ))}
        </select>
        <button type="submit" className="bg-brand-orange text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-brand-ember transition-colors">
          Filter
        </button>
        {status && <Link href="/crm/quotes" className="text-sm text-gray-400 hover:text-gray-600 py-2 px-2">Clear</Link>}
      </form>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {quotes.length === 0 ? (
          <p className="p-8 text-center text-gray-400">No quotes found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="text-left px-5 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wide">Customer</th>
                  <th className="text-left px-5 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wide">Service</th>
                  <th className="text-left px-5 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wide">Crew</th>
                  <th className="text-left px-5 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wide">Est. Hrs</th>
                  <th className="text-left px-5 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wide">Price</th>
                  <th className="text-left px-5 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wide">Sent</th>
                  <th className="text-left px-5 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wide">Status</th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {quotes.map(q => (
                  <tr key={q.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3">
                      <Link href={`/crm/customers/${q.customer.id}`} className="font-semibold text-brand-navy hover:underline">
                        {q.customer.firstName} {q.customer.lastName}
                      </Link>
                    </td>
                    <td className="px-5 py-3 text-gray-600">{SERVICE_LABELS[q.serviceType]}</td>
                    <td className="px-5 py-3 text-gray-600">{q.crewSize}-man</td>
                    <td className="px-5 py-3 text-gray-600">{q.estimatedHours} hrs</td>
                    <td className="px-5 py-3 font-semibold text-gray-900">{fmtMoney(q.quotedPrice.toNumber())}</td>
                    <td className="px-5 py-3 text-gray-400">{fmtDate(q.createdAt)}</td>
                    <td className="px-5 py-3"><StatusBadge status={q.status} type="quote" /></td>
                    <td className="px-5 py-3">
                      <QuoteStatusSelect id={q.id} current={q.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {pages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          {Array.from({ length: pages }, (_, i) => i + 1).map(p => (
            <Link key={p}
              href={`/crm/quotes?${new URLSearchParams({ ...(status ? { status } : {}), page: String(p) })}`}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${p === page ? "bg-brand-navy text-white" : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"}`}>
              {p}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

