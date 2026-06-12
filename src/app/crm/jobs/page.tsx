// CRM ONLY
import { auth } from "@/auth";
import { prisma } from "@/lib/crm/db";
import Link from "next/link";
import { StatusBadge } from "@/components/crm/StatusBadge";
import { JOB_STATUS_LABELS } from "@/lib/crm/utils";
import type { Metadata } from "next";
import type { JobStatus } from "@prisma/client";

export const metadata: Metadata = { title: "Jobs — Sir Box a Lot CRM" };
export const dynamic = "force-dynamic";

function fmtDate(d: Date) {
  return d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" });
}
function fmtMoney(n: number) {
  return `$${n.toFixed(2)}`;
}

export default async function JobsPage({ searchParams }: { searchParams: Promise<Record<string, string>> }) {
  await auth();
  const sp = await searchParams;
  const status   = (sp.status ?? "") as JobStatus | "";
  const upcoming = sp.upcoming === "1";
  const page = Math.max(1, parseInt(sp.page ?? "1"));
  const take = 25;

  const now = new Date();
  const where = {
    ...(status ? { status } : {}),
    ...(upcoming ? { jobDate: { gte: now }, status: { in: ["SCHEDULED", "IN_PROGRESS"] as JobStatus[] } } : {}),
  };

  const [jobs, total] = await Promise.all([
    prisma.job.findMany({
      where,
      orderBy: { jobDate: upcoming ? "asc" : "desc" },
      skip: (page - 1) * take,
      take,
      include: { customer: { select: { id: true, firstName: true, lastName: true } } },
    }),
    prisma.job.count({ where }),
  ]);

  const pages = Math.ceil(total / take);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-heading font-extrabold text-2xl text-brand-navy">Jobs</h1>
          <p className="text-gray-400 text-sm mt-0.5">{total} total</p>
        </div>
        <Link href="/crm/jobs/new"
          className="bg-brand-navy text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-brand-navyLight transition-colors">
          + New Job
        </Link>
      </div>

      {/* Filters */}
      <form method="get" className="flex flex-wrap gap-3 mb-6">
        <select name="status" defaultValue={status}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-orange">
          <option value="">All Statuses</option>
          {(Object.entries(JOB_STATUS_LABELS) as [JobStatus, string][]).map(([v, l]) => (
            <option key={v} value={v}>{l}</option>
          ))}
        </select>
        <label className="flex items-center gap-2 text-sm text-gray-600 border border-gray-200 rounded-lg px-3 py-2">
          <input type="checkbox" name="upcoming" value="1" defaultChecked={upcoming} />
          Upcoming only
        </label>
        <button type="submit" className="bg-brand-orange text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-brand-ember transition-colors">
          Filter
        </button>
        {(status || upcoming) && (
          <Link href="/crm/jobs" className="text-sm text-gray-400 hover:text-gray-600 py-2 px-2">Clear</Link>
        )}
      </form>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {jobs.length === 0 ? (
          <p className="p-8 text-center text-gray-400">No jobs found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="text-left px-5 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wide">Date</th>
                  <th className="text-left px-5 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wide">Customer</th>
                  <th className="text-left px-5 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wide">Crew</th>
                  <th className="text-left px-5 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wide">Time</th>
                  <th className="text-left px-5 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wide">Est. Total</th>
                  <th className="text-left px-5 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wide">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {jobs.map(j => (
                  <tr key={j.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3 font-medium text-gray-900 whitespace-nowrap">{fmtDate(j.jobDate)}</td>
                    <td className="px-5 py-3">
                      <Link href={`/crm/customers/${j.customer.id}`} className="text-brand-navy font-semibold hover:underline">
                        {j.customer.firstName} {j.customer.lastName}
                      </Link>
                    </td>
                    <td className="px-5 py-3 text-gray-600">{j.crewSize}-man</td>
                    <td className="px-5 py-3 text-gray-600">{j.jobTime}</td>
                    <td className="px-5 py-3 text-gray-600">
                      {j.totalCharged ? fmtMoney(j.totalCharged.toNumber()) : fmtMoney(j.estimatedHours * j.pricePerHour.toNumber())}
                    </td>
                    <td className="px-5 py-3">
                      <Link href={`/crm/jobs/${j.id}`}>
                        <StatusBadge status={j.status} type="job" />
                      </Link>
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
              href={`/crm/jobs?${new URLSearchParams({ ...(status ? { status } : {}), ...(upcoming ? { upcoming: "1" } : {}), page: String(p) })}`}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${p === page ? "bg-brand-navy text-white" : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"}`}>
              {p}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
