// CRM ONLY
import { auth } from "@/auth";
import { prisma } from "@/lib/crm/db";
import { ok, err } from "@/lib/crm/utils";

export const runtime = "nodejs";

export async function GET() {
  const session = await auth();
  if (!session) return err("Unauthorized.", 401);

  const leads = await prisma.customer.findMany({
    where: { source: "WEBSITE_CHAT", deletedAt: null },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      phone: true,
      status: true,
      notes: true,
      createdAt: true,
    },
  });

  return ok(leads);
}
