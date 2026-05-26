// CRM ONLY
import { auth } from "@/auth";
import { prisma } from "@/lib/crm/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import { StatusBadge } from "@/components/crm/StatusBadge";
import EmployeeEditForm from "./EmployeeEditForm";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const e = await prisma.employee.findUnique({ where: { id }, select: { firstName: true, lastName: true } });
  return { title: e ? `${e.firstName} ${e.lastName} — CRM` : "Employee — CRM" };
}

function fmtDate(d: Date | null | undefined) {
  if (!d) return "—";
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default async function EmployeeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  await auth();
  const { id } = await params;

  const employee = await prisma.employee.findUnique({
    where: { id },
    include: {
      jobs: {
        include: { job: { include: { customer: { select: { id: true, firstName: true, lastName: true } } } } },
        orderBy: { job: { jobDate: "desc" } },
        take: 20,
      },
    },
  });

  if (!employee) notFound();

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-start justify-between mb-6">
        <div>
          <Link href="/crm/employees" className="text-gray-400 hover:text-gray-600 text-sm">← Employees</Link>
          <h1 className="font-heading font-extrabold text-2xl text-brand-navy mt-1">
            {employee.firstName} {employee.lastName}
          </h1>
          <div className="flex items-center gap-3 mt-1">
            <StatusBadge status={employee.status} type="employee" />
            <span className="text-xs text-gray-400">{employee.role} · Hired {fmtDate(employee.hireDate)}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <EmployeeEditForm employee={employee} />
        </div>

        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100">
              <h2 className="font-heading font-bold text-brand-navy">Job History ({employee.jobs.length})</h2>
            </div>
            {employee.jobs.length === 0 ? (
              <p className="p-5 text-sm text-gray-400">No jobs assigned.</p>
            ) : (
              <div className="divide-y divide-gray-50">
                {employee.jobs.map(ej => (
                  <Link key={ej.jobId} href={`/crm/jobs/${ej.jobId}`}
                    className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50 transition-colors">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900">
                        {ej.job.jobDate.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })} · {ej.job.jobTime}
                      </p>
                      <p className="text-xs text-gray-400">
                        {ej.job.customer.firstName} {ej.job.customer.lastName} · {ej.job.crewSize}-man crew
                      </p>
                    </div>
                    <StatusBadge status={ej.job.status} type="job" />
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
