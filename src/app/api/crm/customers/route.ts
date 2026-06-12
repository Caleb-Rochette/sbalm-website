// CRM ONLY
import { auth } from "@/auth";
import { prisma } from "@/lib/crm/db";
import { sanitize, ok, err } from "@/lib/crm/utils";
import type { CustomerStatus, CustomerSource } from "@prisma/client";

export async function GET(req: Request) {
  const session = await auth();
  if (!session) return err("Unauthorized.", 401);

  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q")?.trim() ?? "";
  const status = searchParams.get("status") as CustomerStatus | null;
  const source = searchParams.get("source") as CustomerSource | null;
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1"));
  const take = Math.min(200, Math.max(1, parseInt(searchParams.get("take") ?? "25")));

  const where = {
    deletedAt: null,
    ...(q ? {
      OR: [
        { firstName: { contains: q, mode: "insensitive" as const } },
        { lastName:  { contains: q, mode: "insensitive" as const } },
        { email:     { contains: q, mode: "insensitive" as const } },
        { phone:     { contains: q, mode: "insensitive" as const } },
      ],
    } : {}),
    ...(status ? { status } : {}),
    ...(source ? { source } : {}),
  };

  const [customers, total] = await Promise.all([
    prisma.customer.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * take,
      take,
      include: { _count: { select: { jobs: true } } },
    }),
    prisma.customer.count({ where }),
  ]);

  return ok({ customers, total, page, pages: Math.ceil(total / take) });
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session) return err("Unauthorized.", 401);

  const body = await req.json().catch(() => null);
  if (!body) return err("Invalid JSON.");

  const firstName = sanitize(body.firstName);
  const lastName  = sanitize(body.lastName);
  if (!firstName || !lastName) return err("First and last name are required.");

  const customer = await prisma.customer.create({
    data: {
      firstName,
      lastName,
      email:  body.email  ? sanitize(body.email)  : null,
      phone:  body.phone  ? sanitize(body.phone)  : null,
      address: body.address ? sanitize(body.address) : null,
      notes:  body.notes  ? sanitize(body.notes)  : null,
      source: body.source ?? "WEBSITE_FORM",
      status: body.status ?? "LEAD",
    },
  });

  return ok(customer);
}
