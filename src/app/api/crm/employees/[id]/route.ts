// CRM ONLY
import { auth } from "@/auth";
import { prisma } from "@/lib/crm/db";
import { sanitize, ok, err } from "@/lib/crm/utils";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session) return err("Unauthorized.", 401);
  const { id } = await params;

  const employee = await prisma.employee.findUnique({
    where: { id },
    include: { jobs: { include: { job: { include: { customer: true } } }, orderBy: { job: { jobDate: "desc" } } } },
  });

  if (!employee) return err("Employee not found.", 404);
  return ok(employee);
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session) return err("Unauthorized.", 401);
  const { id } = await params;

  const body = await req.json().catch(() => null);
  if (!body) return err("Invalid JSON.");

  const employee = await prisma.employee.update({
    where: { id },
    data: {
      ...(body.firstName !== undefined ? { firstName: sanitize(body.firstName) } : {}),
      ...(body.lastName  !== undefined ? { lastName:  sanitize(body.lastName)  } : {}),
      ...(body.role      !== undefined ? { role:      sanitize(body.role)      } : {}),
      ...(body.phone     !== undefined ? { phone:     body.phone  ? sanitize(body.phone)  : null } : {}),
      ...(body.email     !== undefined ? { email:     body.email  ? sanitize(body.email)  : null } : {}),
      ...(body.notes     !== undefined ? { notes:     body.notes  ? sanitize(body.notes)  : null } : {}),
      ...(body.status    !== undefined ? { status:    body.status    } : {}),
      ...(body.hireDate  !== undefined ? { hireDate:  body.hireDate ? new Date(body.hireDate) : null } : {}),
    },
  }).catch(() => null);

  if (!employee) return err("Employee not found.", 404);
  return ok(employee);
}
