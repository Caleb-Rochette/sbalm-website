import { NextResponse } from "next/server";
import { readLeads } from "@/lib/crm-store";

export const runtime = "nodejs";

export async function GET() {
  return NextResponse.json(readLeads());
}
