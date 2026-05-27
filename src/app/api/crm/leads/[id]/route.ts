import { NextRequest, NextResponse } from "next/server";
import { updateLead } from "@/lib/crm-store";

export const runtime = "nodejs";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const updates = await req.json().catch(() => null);
  if (!updates) return NextResponse.json({ error: "Invalid body." }, { status: 400 });

  const allowed = ["name", "contact", "stage", "needsFollowUp", "scheduledDate", "notes"];
  const sanitized = Object.fromEntries(
    Object.entries(updates).filter(([k]) => allowed.includes(k))
  );

  const updated = updateLead(params.id, sanitized);
  if (!updated) return NextResponse.json({ error: "Lead not found." }, { status: 404 });
  return NextResponse.json(updated);
}
