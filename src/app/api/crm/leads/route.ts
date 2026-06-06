import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { readLeads } from "@/lib/crm-store";

export const runtime = "nodejs";

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  return NextResponse.json(readLeads());
}
