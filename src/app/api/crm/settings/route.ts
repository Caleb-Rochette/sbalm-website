// CRM ONLY
import { auth } from "@/auth";
import { prisma } from "@/lib/crm/db";
import { ok, err } from "@/lib/crm/utils";

export async function GET() {
  const session = await auth();
  if (!session) return err("Unauthorized.", 401);

  const settings = await prisma.businessSettings.upsert({
    where: { id: 1 },
    update: {},
    create: { id: 1, rate2ManCrew: 125, rate3ManCrew: 175, minimumHours: 2 },
  });

  return ok(settings);
}

export async function PATCH(req: Request) {
  const session = await auth();
  if (!session) return err("Unauthorized.", 401);

  const body = await req.json().catch(() => null);
  if (!body) return err("Invalid JSON.");

  const settings = await prisma.businessSettings.upsert({
    where: { id: 1 },
    create: {
      id: 1,
      rate2ManCrew:  body.rate2ManCrew  ? Number(body.rate2ManCrew)  : 125,
      rate3ManCrew:  body.rate3ManCrew  ? Number(body.rate3ManCrew)  : 175,
      minimumHours:  body.minimumHours  ? Number(body.minimumHours)  : 2,
    },
    update: {
      ...(body.rate2ManCrew !== undefined ? { rate2ManCrew: Number(body.rate2ManCrew) } : {}),
      ...(body.rate3ManCrew !== undefined ? { rate3ManCrew: Number(body.rate3ManCrew) } : {}),
      ...(body.minimumHours !== undefined ? { minimumHours: Number(body.minimumHours) } : {}),
    },
  });

  return ok(settings);
}
