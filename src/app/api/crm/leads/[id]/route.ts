// CRM ONLY
import { auth } from "@/auth";
import { prisma } from "@/lib/crm/db";
import { ok, err } from "@/lib/crm/utils";
import type { CustomerStatus } from "@prisma/client";

export const runtime = "nodejs";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session) return err("Unauthorized.", 401);
  const { id } = await params;

  const body = await req.json().catch(() => null);
  if (!body) return err("Invalid body.");

  const customer = await prisma.customer.update({
    where: { id, source: "WEBSITE_CHAT" },
    data: {
      ...(body.status !== undefined ? { status: body.status as CustomerStatus } : {}),
      ...(body.notes  !== undefined ? { notes:  String(body.notes) }            : {}),
    },
  }).catch(() => null);

  if (!customer) return err("Lead not found.", 404);
  return ok(customer);
}
