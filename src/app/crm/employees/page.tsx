// CRM ONLY
import { auth } from "@/auth";
import { prisma } from "@/lib/crm/db";
import Link from "next/link";
import { StatusBadge } from "@/components/crm/StatusBadge";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Employees — Sir Box a Lot CRM" };
export const dynamic = "force-dynamic";

export default async function EmployeesPage() {
  await auth();

  const employees = await prisma.employee.findMany({
    orderBy: [{ status: "asc" }, { lastName: "asc" }],
    include: { _count: { select: { jobs: true } } },
  });

  const active   = employees.filter(e => e.status === "ACTIVE");
  const inactive = employees.filter(e => e.status === "INACTIVE");

  function EmployeeRow({ e }: { e: typeof employees[0] }) {
    return (
      <tr className="hover:bg-gray-50 transition-colors">
        <td className="px-5 py-3">
          <Link href={`/crm/employees/${e.id}`} className="font-semibold text-brand-navy hover:underline">
            {e.firstName} {e.lastName}
          </Link>
        </td>
        <td className="px-5 py-3 text-gray-600">{e.role}</td>
        <td className="px-5 py-3 text-gray-600">{e.phone ?? <span className="text-gray-300">—</span>}</td>
        <td className="px-5 py-3 text-gray-600">{e._count.jobs}</td>
        <td className="px-5 py-3"><StatusBadge status={e.status} type="employee" /></td>
      </tr>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-heading font-extrabold text-2xl text-brand-navy">Employees</h1>
          <p className="text-gray-400 text-sm mt-0.5">{active.length} active · {inactive.length} inactive</p>
        </div>
        <Link href="/crm/employees/new"
          className="bg-brand-navy text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-brand-navyLight transition-colors">
          + Add Employee
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {employees.length === 0 ? (
          <p className="p-8 text-center text-gray-400">No employees yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="text-left px-5 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wide">Name</th>
                  <th className="text-left px-5 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wide">Role</th>
                  <th className="text-left px-5 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wide">Phone</th>
                  <th className="text-left px-5 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wide">Jobs</th>
                  <th className="text-left px-5 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wide">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {employees.map(e => <EmployeeRow key={e.id} e={e} />)}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
