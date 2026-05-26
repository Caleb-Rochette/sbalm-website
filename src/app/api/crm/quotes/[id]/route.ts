// CRM ONLY
import { auth } from "@/auth";
import { prisma } from "@/lib/crm/db";
import { sanitize, ok, err } from "@/lib/crm/utils";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session) return err("Unauthorized.", 401);
  const { id } = await params;

  const body = await req.json().catch(() => null);
  if (!body) return err("Invalid JSON.");

  const quote = await prisma.quote.update({
    where: { id },
    data: {
      ...(body.status        !== undefined ? { status:        body.status } : {}),
      ...(body.quotedPrice   !== undefined ? { quotedPrice:   Number(body.quotedPrice) } : {}),
      ...(body.estimatedHours !== undefined ? { estimatedHours: Number(body.estimatedHours) } : {}),
      ...(body.crewSize      !== undefined ? { crewSize:      Number(body.crewSize) } : {}),
      ...(body.serviceType   !== undefined ? { serviceType:   body.serviceType } : {}),
      ...(body.originAddress !== undefined ? { originAddress: sanitize(body.originAddress) } : {}),
      ...(body.destinationAddress !== undefined ? { destinationAddress: sanitize(body.destinationAddress) } : {}),
      ...(body.notes         !== undefined ? { notes:         body.notes ? sanitize(body.notes) : null } : {}),
      ...(body.expiresAt     !== undefined ? { expiresAt:     body.expiresAt ? new Date(body.expiresAt) : null } : {}),
    },
  }).catch(() => null);

  if (!quote) return err("Quote not found.", 404);
  return ok(quote);
}
