// CRM ONLY
import { auth } from "@/auth";
import { prisma } from "@/lib/crm/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import { StatusBadge } from "@/components/crm/StatusBadge";
import { SERVICE_LABELS, INTERACTION_LABELS } from "@/lib/crm/utils";
import JobEditForm from "./JobEditForm";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const j = await prisma.job.findUnique({ where: { id }, include: { customer: { select: { firstName: true, lastName: true } } } });
  return { title: j ? `Job — ${j.customer.firstName} ${j.customer.lastName} — CRM` : "Job — CRM" };
}

function fmtDate(d: Date) {
  return d.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });
}
function fmtMoney(n: number | null | undefined) {
  if (n == null) return "—";
  return `$${n.toFixed(2)}`;
}

export default async function JobDetailPage({ params }: { params: Promise<{ id: string }> }) {
  await auth();
  const { id } = await params;

  const job = await prisma.job.findUnique({
    where: { id },
    include: {
      customer:     true,
      employees:    { include: { employee: true } },
      interactions: { include: { createdBy: { select: { name: true } } }, orderBy: { createdAt: "desc" } },
    },
  });

  if (!job) notFound();

  const estimated = job.estimatedHours * job.pricePerHour;
  const charged   = job.totalCharged;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link href="/crm/jobs" className="text-gray-400 hover:text-gray-600 text-sm">← Jobs</Link>
          </div>
          <h1 className="font-heading font-extrabold text-2xl text-brand-navy">
            {fmtDate(job.jobDate)}
          </h1>
          <div className="flex items-center gap-3 mt-1">
            <StatusBadge status={job.status} type="job" />
            <Link href={`/crm/customers/${job.customerId}`} className="text-sm font-semibold text-brand-orange hover:underline">
              {job.customer.firstName} {job.customer.lastName}
            </Link>
            <span className="text-xs text-gray-400">{job.jobTime} · {job.crewSize}-man crew · {SERVICE_LABELS[job.serviceType]}</span>
          </div>
        </div>
        <Link href={`/crm/interactions/new?customerId=${job.customerId}&jobId=${job.id}`}
          className="bg-brand-navy text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-brand-navyLight transition-colors">
          + Log Interaction
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Edit form */}
        <div className="lg:col-span-1">
          <JobEditForm job={job} />
        </div>

        {/* Right column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Summary card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <h2 className="font-heading font-bold text-brand-navy mb-4">Job Summary</h2>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wide font-semibold">Origin</p>
                <p className="text-gray-700 mt-0.5">{job.originAddress}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wide font-semibold">Destination</p>
                <p className="text-gray-700 mt-0.5">{job.destinationAddress}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wide font-semibold">Est. Hours</p>
                <p className="text-gray-700 mt-0.5">{job.estimatedHours} hrs</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wide font-semibold">Actual Hours</p>
                <p className="text-gray-700 mt-0.5">{job.actualHours ? `${job.actualHours} hrs` : "—"}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wide font-semibold">Rate</p>
                <p className="text-gray-700 mt-0.5">{fmtMoney(job.pricePerHour)}/hr</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wide font-semibold">Est. Total</p>
                <p className="text-gray-700 mt-0.5">{fmtMoney(estimated)}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wide font-semibold">Amount Charged</p>
                <p className="font-bold text-brand-navy mt-0.5">{fmtMoney(charged)}</p>
              </div>
              {job.truckRentalCompany && (
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wide font-semibold">Truck Rental</p>
                  <p className="text-gray-700 mt-0.5">{job.truckRentalCompany}</p>
                </div>
              )}
            </div>
            {job.notes && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-xs text-gray-400 uppercase tracking-wide font-semibold mb-1">Notes</p>
                <p className="text-sm text-gray-600">{job.notes}</p>
              </div>
            )}
          </div>

          {/* Crew */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100">
              <h2 className="font-heading font-bold text-brand-navy">Assigned Crew ({job.employees.length})</h2>
            </div>
            {job.employees.length === 0 ? (
              <p className="p-5 text-sm text-gray-400">No crew assigned yet.</p>
            ) : (
              <div className="divide-y divide-gray-50">
                {job.employees.map(ej => (
                  <div key={ej.employeeId} className="flex items-center gap-3 px-5 py-3">
                    <div className="w-8 h-8 bg-brand-navy text-white rounded-full flex items-center justify-center text-xs font-bold">
                      {ej.employee.firstName[0]}{ej.employee.lastName[0]}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{ej.employee.firstName} {ej.employee.lastName}</p>
                      <p className="text-xs text-gray-400">{ej.employee.role}</p>
                    </div>
                    <Link href={`/crm/employees/${ej.employee.id}`} className="ml-auto text-xs text-gray-400 hover:text-gray-600">View</Link>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Interactions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="font-heading font-bold text-brand-navy">Interactions ({job.interactions.length})</h2>
              <Link href={`/crm/interactions/new?customerId=${job.customerId}&jobId=${job.id}`} className="text-xs text-brand-orange hover:underline">+ Add</Link>
            </div>
            {job.interactions.length === 0 ? (
              <p className="p-5 text-sm text-gray-400">No interactions logged.</p>
            ) : (
              <div className="divide-y divide-gray-50">
                {job.interactions.map(i => (
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
