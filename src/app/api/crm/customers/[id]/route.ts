// CRM ONLY
import { auth } from "@/auth";
import { prisma } from "@/lib/crm/db";
import { sanitize, ok, err } from "@/lib/crm/utils";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session) return err("Unauthorized.", 401);
  const { id } = await params;

  const customer = await prisma.customer.findUnique({
    where: { id },
    include: {
      jobs:         { orderBy: { jobDate: "desc" } },
      interactions: { include: { createdBy: true, job: true }, orderBy: { createdAt: "desc" } },
      quotes:       { orderBy: { createdAt: "desc" } },
    },
  });

  if (!customer) return err("Customer not found.", 404);
  return ok(customer);
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session) return err("Unauthorized.", 401);
  const { id } = await params;

  const body = await req.json().catch(() => null);
  if (!body) return err("Invalid JSON.");

  const customer = await prisma.customer.update({
    where: { id },
    data: {
      ...(body.firstName !== undefined ? { firstName: sanitize(body.firstName) } : {}),
      ...(body.lastName  !== undefined ? { lastName:  sanitize(body.lastName)  } : {}),
      ...(body.email     !== undefined ? { email:     body.email  ? sanitize(body.email)  : null } : {}),
      ...(body.phone     !== undefined ? { phone:     body.phone  ? sanitize(body.phone)  : null } : {}),
      ...(body.address   !== undefined ? { address:   body.address ? sanitize(body.address) : null } : {}),
      ...(body.notes     !== undefined ? { notes:     body.notes  ? sanitize(body.notes)  : null } : {}),
      ...(body.status    !== undefined ? { status:    body.status    } : {}),
      ...(body.source    !== undefined ? { source:    body.source    } : {}),
    },
  }).catch(() => null);

  if (!customer) return err("Customer not found.", 404);
  return ok(customer);
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session) return err("Unauthorized.", 401);
  const { id } = await params;

  const exists = await prisma.customer.findUnique({ where: { id }, select: { id: true } });
  if (!exists) return err("Customer not found.", 404);

  await prisma.customer.update({ where: { id }, data: { deletedAt: new Date() } });

  return ok({ deleted: true });
}
