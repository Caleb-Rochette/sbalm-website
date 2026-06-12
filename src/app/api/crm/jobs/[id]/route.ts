// CRM ONLY
import { auth } from "@/auth";
import { prisma } from "@/lib/crm/db";
import { sanitize, ok, err } from "@/lib/crm/utils";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session) return err("Unauthorized.", 401);
  const { id } = await params;

  const job = await prisma.job.findUnique({
    where: { id },
    include: {
      customer:     true,
      employees:    { include: { employee: true } },
      interactions: { include: { createdBy: true }, orderBy: { createdAt: "desc" } },
    },
  });

  if (!job) return err("Job not found.", 404);
  return ok(job);
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session) return err("Unauthorized.", 401);
  const { id } = await params;

  const body = await req.json().catch(() => null);
  if (!body) return err("Invalid JSON.");

  const job = await prisma.job.update({
    where: { id },
    data: {
      ...(body.status             !== undefined ? { status:             body.status } : {}),
      ...(body.jobDate            !== undefined ? { jobDate:            new Date(body.jobDate) } : {}),
      ...(body.jobTime            !== undefined ? { jobTime:            sanitize(body.jobTime) } : {}),
      ...(body.crewSize           !== undefined ? { crewSize:           Number(body.crewSize) } : {}),
      ...(body.serviceType        !== undefined ? { serviceType:        body.serviceType } : {}),
      ...(body.originAddress      !== undefined ? { originAddress:      sanitize(body.originAddress) } : {}),
      ...(body.destinationAddress !== undefined ? { destinationAddress: sanitize(body.destinationAddress) } : {}),
      ...(body.estimatedHours     !== undefined ? { estimatedHours:     Number(body.estimatedHours) } : {}),
      ...(body.actualHours        !== undefined ? { actualHours:        body.actualHours ? Number(body.actualHours) : null } : {}),
      ...(body.pricePerHour       !== undefined ? { pricePerHour:       Number(body.pricePerHour) } : {}),
      ...(body.totalCharged       !== undefined ? { totalCharged:       body.totalCharged ? Number(body.totalCharged) : null } : {}),
      ...(body.truckRentalCompany !== undefined ? { truckRentalCompany: body.truckRentalCompany ? sanitize(body.truckRentalCompany) : null } : {}),
      ...(body.notes              !== undefined ? { notes:              body.notes ? sanitize(body.notes) : null } : {}),
    },
    include: { customer: true },
  }).catch(() => null);

  if (!job) return err("Job not found.", 404);
  return ok(job);
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session) return err("Unauthorized.", 401);
  const { id } = await params;

  await prisma.job.update({ where: { id }, data: { deletedAt: new Date() } }).catch(() => null);
  return ok({ deleted: true });
}
