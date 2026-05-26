// CRM ONLY
import { auth } from "@/auth";
import { prisma } from "@/lib/crm/db";
import { sanitize, ok, err } from "@/lib/crm/utils";

export async function POST(req: Request) {
  const session = await auth();
  if (!session) return err("Unauthorized.", 401);

  const body = await req.json().catch(() => null);
  if (!body) return err("Invalid JSON.");

  const { customerId, type, summary } = body;
  if (!customerId || !type || !summary) return err("customerId, type, and summary are required.");

  const interaction = await prisma.interaction.create({
    data: {
      customerId:  sanitize(customerId),
      type,
      summary:     sanitize(summary),
      createdById: session.user.id,
      jobId: body.jobId ? sanitize(body.jobId) : null,
    },
    include: { customer: true, createdBy: true },
  });

  return ok(interaction);
}
