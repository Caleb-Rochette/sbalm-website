// CRM ONLY
import { auth } from "@/auth";
import { prisma } from "@/lib/crm/db";
import { sanitize, ok, err } from "@/lib/crm/utils";
import type { JobStatus } from "@prisma/client";

export async function GET(req: Request) {
  const session = await auth();
  if (!session) return err("Unauthorized.", 401);

  const { searchParams } = new URL(req.url);
  const status     = searchParams.get("status") as JobStatus | null;
  const upcoming   = searchParams.get("upcoming") === "1";
  const customerId = searchParams.get("customerId");
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1"));
  const take = Math.min(200, Math.max(1, parseInt(searchParams.get("take") ?? "25")));

  const now = new Date();
  const where = {
    deletedAt: null,
    ...(customerId ? { customerId } : {}),
    ...(status ? { status } : {}),
    ...(upcoming ? { jobDate: { gte: now } } : {}),
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

  return ok({ jobs, total, page, pages: Math.ceil(total / take) });
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session) return err("Unauthorized.", 401);

  const body = await req.json().catch(() => null);
  if (!body) return err("Invalid JSON.");

  const { customerId, jobDate, jobTime, crewSize, serviceType, originAddress, destinationAddress, estimatedHours, pricePerHour } = body;
  if (!customerId || !jobDate || !jobTime || !crewSize || !serviceType || !originAddress || !destinationAddress || !estimatedHours || !pricePerHour) {
    return err("Missing required fields.");
  }

  const job = await prisma.job.create({
    data: {
      customerId: sanitize(customerId),
      jobDate: new Date(jobDate),
      jobTime: sanitize(jobTime),
      crewSize: Number(crewSize),
      serviceType,
      originAddress:      sanitize(originAddress),
      destinationAddress: sanitize(destinationAddress),
      estimatedHours:  Number(estimatedHours),
      pricePerHour:    Number(pricePerHour),
      truckRentalCompany: body.truckRentalCompany ? sanitize(body.truckRentalCompany) : null,
      notes: body.notes ? sanitize(body.notes) : null,
      status: body.status ?? "SCHEDULED",
    },
    include: { customer: true },
  });

  // Update customer status to BOOKED if still a LEAD
  await prisma.customer.updateMany({
    where: { id: customerId, status: "LEAD" },
    data: { status: "BOOKED" },
  });

  return ok(job);
}
