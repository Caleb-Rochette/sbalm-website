// CRM ONLY
import { auth } from "@/auth";
import { prisma } from "@/lib/crm/db";
import { sanitize, ok, err } from "@/lib/crm/utils";

export async function GET(req: Request) {
  const session = await auth();
  if (!session) return err("Unauthorized.", 401);

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");
  const activeOnly = status === "ACTIVE" || searchParams.get("active") === "1";

  const employees = await prisma.employee.findMany({
    where: activeOnly ? { status: "ACTIVE" } : {},
    orderBy: [{ status: "asc" }, { lastName: "asc" }],
    include: { _count: { select: { jobs: true } } },
  });

  return ok(employees);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session) return err("Unauthorized.", 401);

  const body = await req.json().catch(() => null);
  if (!body) return err("Invalid JSON.");

  const firstName = sanitize(body.firstName);
  const lastName  = sanitize(body.lastName);
  const role      = sanitize(body.role);
  if (!firstName || !lastName || !role) return err("First name, last name, and role are required.");

  const employee = await prisma.employee.create({
    data: {
      firstName,
      lastName,
      role,
      phone:    body.phone    ? sanitize(body.phone)    : null,
      email:    body.email    ? sanitize(body.email)    : null,
      notes:    body.notes    ? sanitize(body.notes)    : null,
      status:   body.status   ?? "ACTIVE",
      hireDate: body.hireDate ? new Date(body.hireDate) : null,
    },
  });

  return ok(employee);
}
