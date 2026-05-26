import { NextRequest, NextResponse } from "next/server";
import { readLeads } from "@/lib/crm-store";
import { verifyToken, COOKIE } from "@/lib/auth-crm";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const token = req.cookies.get(COOKIE)?.value;
  if (!token || !verifyToken(token))
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  return NextResponse.json(readLeads());
}
