// CRM ONLY
import { auth } from "@/auth";
import { prisma } from "@/lib/crm/db";
import Link from "next/link";
import { StatusBadge } from "@/components/crm/StatusBadge";
import { SOURCE_LABELS, STATUS_LABELS } from "@/lib/crm/utils";
import type { Metadata } from "next";
import type { CustomerStatus } from "@prisma/client";

export const metadata: Metadata = { title: "Customers — Sir Box a Lot CRM" };
export const dynamic = "force-dynamic";

function fmtDate(d: Date) {
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default async function CustomersPage({ searchParams }: { searchParams: Promise<Record<string, string>> }) {
  await auth();
  const sp = await searchParams;
  const q      = sp.q      ?? "";
  const status = (sp.status ?? "") as CustomerStatus | "";
  const page   = Math.max(1, parseInt(sp.page ?? "1"));
  const take   = 25;

  const where = {
    deletedAt: null,
    ...(q ? {
      OR: [
        { firstName: { contains: q, mode: "insensitive" as const } },
        { lastName:  { contains: q, mode: "insensitive" as const } },
        { email:     { contains: q, mode: "insensitive" as const } },
        { phone:     { contains: q, mode: "insensitive" as const } },
      ],
    } : {}),
    ...(status ? { status } : {}),
  };

  const [customers, total] = await Promise.all([
    prisma.customer.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * take,
      take,
      include: { _count: { select: { jobs: true } } },
    }),
    prisma.customer.count({ where }),
  ]);

  const pages = Math.ceil(total / take);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-heading font-extrabold text-2xl text-brand-navy">Customers</h1>
          <p className="text-gray-400 text-sm mt-0.5">{total} total</p>
        </div>
        <Link href="/crm/customers/new"
          className="bg-brand-navy text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-brand-navyLight transition-colors">
          + New Customer
        </Link>
      </div>

      {/* Filters */}
      <form method="get" className="flex flex-wrap gap-3 mb-6">
        <input name="q" defaultValue={q} placeholder="Search name, email, phone…"
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm w-64 focus:outline-none focus:border-brand-orange" />
        <select name="status" defaultValue={status}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-orange">
          <option value="">All Statuses</option>
          {(Object.entries(STATUS_LABELS) as [CustomerStatus, string][]).map(([v, l]) => (
            <option key={v} value={v}>{l}</option>
          ))}
        </select>
        <button type="submit" className="bg-brand-orange text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-brand-ember transition-colors">
          Search
        </button>
        {(q || status) && (
          <Link href="/crm/customers" className="text-sm text-gray-400 hover:text-gray-600 py-2 px-2">Clear</Link>
        )}
      </form>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {customers.length === 0 ? (
          <p className="p-8 text-center text-gray-400">No customers found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="text-left px-5 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wide">Name</th>
                  <th className="text-left px-5 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wide">Phone</th>
                  <th className="text-left px-5 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wide">Email</th>
                  <th className="text-left px-5 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wide">Source</th>
                  <th className="text-left px-5 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wide">Status</th>
                  <th className="text-left px-5 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wide">Jobs</th>
                  <th className="text-left px-5 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wide">Added</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {customers.map(c => (
                  <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3">
                      <Link href={`/crm/customers/${c.id}`} className="font-semibold text-brand-navy hover:underline">
                        {c.firstName} {c.lastName}
                      </Link>
                    </td>
                    <td className="px-5 py-3 text-gray-600">{c.phone ?? <span className="text-gray-300">—</span>}</td>
                    <td className="px-5 py-3 text-gray-600 max-w-[180px] truncate">{c.email ?? <span className="text-gray-300">—</span>}</td>
                    <td className="px-5 py-3 text-gray-500">{SOURCE_LABELS[c.source]}</td>
                    <td className="px-5 py-3"><StatusBadge status={c.status} type="customer" /></td>
                    <td className="px-5 py-3 text-gray-600">{c._count.jobs}</td>
                    <td className="px-5 py-3 text-gray-400">{fmtDate(c.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {pages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          {Array.from({ length: pages }, (_, i) => i + 1).map(p => (
            <Link key={p}
              href={`/crm/customers?${new URLSearchParams({ ...(q ? { q } : {}), ...(status ? { status } : {}), page: String(p) })}`}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${p === page ? "bg-brand-navy text-white" : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"}`}>
              {p}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
