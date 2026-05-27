// CRM ONLY
import { auth } from "@/auth";
import { prisma } from "@/lib/crm/db";
import Link from "next/link";
import { StatusBadge } from "@/components/crm/StatusBadge";
import { INTERACTION_LABELS } from "@/lib/crm/utils";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Dashboard — Sir Box a Lot CRM" };
export const dynamic = "force-dynamic";

const SOURCE_LABELS: Record<string, string> = {
  WEBSITE_CHAT: "Chat",
  WEBSITE_FORM: "Form",
  PHONE_CALL:   "Phone",
  REFERRAL:     "Referral",
  GOOGLE:       "Google",
  OTHER:        "Other",
};

function fmtDate(d: Date) {
  return d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
}

export default async function DashboardPage() {
  const session = await auth();
  const now = new Date();
  const todayStart = new Date(now); todayStart.setHours(0,0,0,0);
  const todayEnd = new Date(now); todayEnd.setHours(23,59,59,999);
  const weekEnd = new Date(now); weekEnd.setDate(weekEnd.getDate() + 7);

  const [todayJobs, weekJobs, openLeads, totalCustomers, upcomingJobs, recentActivity, openLeadsList] = await Promise.all([
    prisma.job.count({ where: { jobDate: { gte: todayStart, lte: todayEnd } } }),
    prisma.job.count({ where: { jobDate: { gte: todayStart, lte: weekEnd }, status: { in: ["SCHEDULED", "IN_PROGRESS"] } } }),
    prisma.customer.count({ where: { status: "LEAD" } }),
    prisma.customer.count(),
    prisma.job.findMany({
      where: { jobDate: { gte: todayStart, lte: weekEnd }, status: { in: ["SCHEDULED", "IN_PROGRESS"] } },
      include: { customer: true },
      orderBy: { jobDate: "asc" },
      take: 10,
    }),
    prisma.interaction.findMany({
      include: { customer: true, createdBy: true },
      orderBy: { createdAt: "desc" },
      take: 10,
    }),
    prisma.customer.findMany({
      where: { status: "LEAD" },
      orderBy: { createdAt: "desc" },
      take: 8,
    }),
  ]);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="font-heading font-extrabold text-2xl text-brand-navy">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-0.5">Welcome back, {session?.user.name}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Today's Jobs",      value: todayJobs,       color: "text-brand-orange" },
          { label: "Jobs This Week",    value: weekJobs,        color: "text-blue-600" },
          { label: "Open Leads",        value: openLeads,       color: "text-amber-500" },
          { label: "Total Customers",   value: totalCustomers,  color: "text-brand-navy" },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <p className={`text-3xl font-extrabold ${s.color}`}>{s.value}</p>
            <p className="text-gray-400 text-sm mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div className="flex flex-wrap gap-3 mb-8">
        {[
          { href: "/crm/customers/new",     label: "+ New Customer" },
          { href: "/crm/jobs/new",          label: "+ New Job" },
          { href: "/crm/interactions/new",  label: "+ Log Interaction" },
          { href: "/crm/quotes/new",        label: "+ New Quote" },
        ].map(a => (
          <Link key={a.href} href={a.href}
            className="bg-brand-navy text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-brand-navyLight transition-colors">
            {a.label}
          </Link>
        ))}
      </div>

      {/* Open Leads */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-6">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-heading font-bold text-brand-navy">Open Leads</h2>
          <Link href="/crm/customers?status=LEAD" className="text-xs text-brand-orange hover:underline">View all</Link>
        </div>
        {openLeadsList.length === 0 ? (
          <p className="p-5 text-sm text-gray-400">No open leads right now.</p>
        ) : (
          <div className="divide-y divide-gray-50">
            {openLeadsList.map(lead => (
              <Link key={lead.id} href={`/crm/customers/${lead.id}`}
                className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50 transition-colors">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">
                    {lead.firstName} {lead.lastName}
                  </p>
                  <p className="text-xs text-gray-400 truncate">
                    {lead.phone ?? lead.email ?? "No contact info"}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs text-gray-300">{fmtDate(lead.createdAt)}</span>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-700">
                    {SOURCE_LABELS[lead.source] ?? lead.source}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming jobs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-heading font-bold text-brand-navy">Upcoming Jobs (7 days)</h2>
            <Link href="/crm/jobs" className="text-xs text-brand-orange hover:underline">View all</Link>
          </div>
          {upcomingJobs.length === 0 ? (
            <p className="p-5 text-sm text-gray-400">No upcoming jobs.</p>
          ) : (
            <div className="divide-y divide-gray-50">
              {upcomingJobs.map(j => (
                <Link key={j.id} href={`/crm/jobs/${j.id}`}
                  className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50 transition-colors">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">
                      {j.customer.firstName} {j.customer.lastName}
                    </p>
                    <p className="text-xs text-gray-400">{fmtDate(j.jobDate)} · {j.jobTime} · {j.crewSize}-man crew</p>
                  </div>
                  <StatusBadge status={j.status} type="job" />
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Recent activity */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100">
            <h2 className="font-heading font-bold text-brand-navy">Recent Activity</h2>
          </div>
          {recentActivity.length === 0 ? (
            <p className="p-5 text-sm text-gray-400">No recent activity.</p>
          ) : (
            <div className="divide-y divide-gray-50">
              {recentActivity.map(i => (
                <div key={i.id} className="px-5 py-3">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-xs font-semibold text-brand-orange">{INTERACTION_LABELS[i.type]}</span>
                    <span className="text-xs text-gray-400">·</span>
                    <Link href={`/crm/customers/${i.customerId}`} className="text-xs font-medium text-gray-700 hover:underline">
                      {i.customer.firstName} {i.customer.lastName}
                    </Link>
                  </div>
                  <p className="text-xs text-gray-500 truncate">{i.summary}</p>
                  <p className="text-xs text-gray-300 mt-0.5">{i.createdAt.toLocaleDateString()} · {i.createdBy.name}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
