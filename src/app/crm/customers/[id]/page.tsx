// CRM ONLY
import { auth } from "@/auth";
import { prisma } from "@/lib/crm/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import { StatusBadge } from "@/components/crm/StatusBadge";
import { SOURCE_LABELS, INTERACTION_LABELS } from "@/lib/crm/utils";
import CustomerEditForm from "./CustomerEditForm";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const c = await prisma.customer.findUnique({ where: { id }, select: { firstName: true, lastName: true } });
  return { title: c ? `${c.firstName} ${c.lastName} — CRM` : "Customer — CRM" };
}

function fmtDate(d: Date) {
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}
function fmtMoney(n: number | null | undefined) {
  if (n == null) return "—";
  return `$${n.toFixed(2)}`;
}

export default async function CustomerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  await auth();
  const { id } = await params;

  const customer = await prisma.customer.findUnique({
    where: { id },
    include: {
      jobs:         { orderBy: { jobDate: "desc" } },
      interactions: { include: { createdBy: { select: { name: true } }, job: { select: { id: true } } }, orderBy: { createdAt: "desc" } },
      quotes:       { orderBy: { createdAt: "desc" } },
    },
  });

  if (!customer) notFound();

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link href="/crm/customers" className="text-gray-400 hover:text-gray-600 text-sm">← Customers</Link>
          </div>
          <h1 className="font-heading font-extrabold text-2xl text-brand-navy">
            {customer.firstName} {customer.lastName}
          </h1>
          <div className="flex items-center gap-3 mt-1">
            <StatusBadge status={customer.status} type="customer" />
            <span className="text-xs text-gray-400">{SOURCE_LABELS[customer.source]} · Added {fmtDate(customer.createdAt)}</span>
          </div>
        </div>
        <div className="flex gap-2">
          <Link href={`/crm/jobs/new?customerId=${customer.id}`}
            className="bg-brand-orange text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-brand-ember transition-colors">
            + New Job
          </Link>
          <Link href={`/crm/interactions/new?customerId=${customer.id}`}
            className="bg-brand-navy text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-brand-navyLight transition-colors">
            + Log Interaction
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Edit form */}
        <div className="lg:col-span-1">
          <CustomerEditForm
            customer={customer}
            counts={{
              jobs: customer.jobs.length,
              interactions: customer.interactions.length,
              quotes: customer.quotes.length,
            }}
          />
        </div>

        {/* Right column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Jobs */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="font-heading font-bold text-brand-navy">Jobs ({customer.jobs.length})</h2>
              <Link href={`/crm/jobs/new?customerId=${customer.id}`} className="text-xs text-brand-orange hover:underline">+ Add</Link>
            </div>
            {customer.jobs.length === 0 ? (
              <p className="p-5 text-sm text-gray-400">No jobs yet.</p>
            ) : (
              <div className="divide-y divide-gray-50">
                {customer.jobs.map(j => (
                  <Link key={j.id} href={`/crm/jobs/${j.id}`}
                    className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50 transition-colors">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900">
                        {j.jobDate.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })} · {j.jobTime}
                      </p>
                      <p className="text-xs text-gray-400">{j.crewSize}-man crew · {fmtMoney(j.totalCharged ?? j.estimatedHours * j.pricePerHour)}</p>
                    </div>
                    <StatusBadge status={j.status} type="job" />
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Quotes */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="font-heading font-bold text-brand-navy">Quotes ({customer.quotes.length})</h2>
              <Link href={`/crm/quotes/new?customerId=${customer.id}`} className="text-xs text-brand-orange hover:underline">+ Add</Link>
            </div>
            {customer.quotes.length === 0 ? (
              <p className="p-5 text-sm text-gray-400">No quotes yet.</p>
            ) : (
              <div className="divide-y divide-gray-50">
                {customer.quotes.map(q => (
                  <div key={q.id} className="flex items-center gap-3 px-5 py-3">
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-900">{fmtMoney(q.quotedPrice)}</p>
                      <p className="text-xs text-gray-400">Sent {fmtDate(q.createdAt)}{q.expiresAt ? ` · Expires ${fmtDate(q.expiresAt)}` : ""}</p>
                    </div>
                    <StatusBadge status={q.status} type="quote" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Interactions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="font-heading font-bold text-brand-navy">Interactions ({customer.interactions.length})</h2>
              <Link href={`/crm/interactions/new?customerId=${customer.id}`} className="text-xs text-brand-orange hover:underline">+ Add</Link>
            </div>
            {customer.interactions.length === 0 ? (
              <p className="p-5 text-sm text-gray-400">No interactions logged.</p>
            ) : (
              <div className="divide-y divide-gray-50">
                {customer.interactions.map(i => (
                  <div key={i.id} className="px-5 py-3">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-xs font-semibold text-brand-orange">{INTERACTION_LABELS[i.type]}</span>
                      <span className="text-xs text-gray-300">·</span>
                      <span className="text-xs text-gray-400">{i.createdAt.toLocaleDateString()} · {i.createdBy.name}</span>
                    </div>
                    <p className="text-sm text-gray-700">{i.summary}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
