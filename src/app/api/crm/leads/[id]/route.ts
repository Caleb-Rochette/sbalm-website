import { NextRequest, NextResponse } from "next/server";
import { updateLead } from "@/lib/crm-store";
import { verifyToken, COOKIE } from "@/lib/auth-crm";

export const runtime = "nodejs";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const token = req.cookies.get(COOKIE)?.value;
  if (!token || !verifyToken(token))
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });

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
