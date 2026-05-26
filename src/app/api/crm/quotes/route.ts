// CRM ONLY
import { auth } from "@/auth";
import { prisma } from "@/lib/crm/db";
import { sanitize, ok, err } from "@/lib/crm/utils";

export async function GET(req: Request) {
  const session = await auth();
  if (!session) return err("Unauthorized.", 401);

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1"));
  const take = 25;

  const where = status ? { status: status as never } : {};

  const [quotes, total] = await Promise.all([
    prisma.quote.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * take,
      take,
      include: { customer: { select: { id: true, firstName: true, lastName: true } } },
    }),
    prisma.quote.count({ where }),
  ]);

  return ok({ quotes, total, page, pages: Math.ceil(total / take) });
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session) return err("Unauthorized.", 401);

  const body = await req.json().catch(() => null);
  if (!body) return err("Invalid JSON.");

  const { customerId, crewSize, estimatedHours, serviceType, originAddress, destinationAddress, quotedPrice } = body;
  if (!customerId || !crewSize || !estimatedHours || !serviceType || !originAddress || !destinationAddress || !quotedPrice) {
    return err("Missing required fields.");
  }

  const quote = await prisma.quote.create({
    data: {
      customerId:         sanitize(customerId),
      crewSize:           Number(crewSize),
      estimatedHours:     Number(estimatedHours),
      serviceType,
      originAddress:      sanitize(originAddress),
      destinationAddress: sanitize(destinationAddress),
      quotedPrice:        Number(quotedPrice),
      notes:    body.notes    ? sanitize(body.notes)    : null,
      expiresAt: body.expiresAt ? new Date(body.expiresAt) : null,
      status: "SENT",
    },
    include: { customer: true },
  });

  return ok(quote);
}
