// CRM ONLY
import { auth } from "@/auth";
import { err } from "@/lib/crm/utils";
import fs from "fs";
import path from "path";

export const runtime = "nodejs";

export interface LeadEntry {
  timestamp: string;
  transcript: string;
}

function parseLeadsLog(raw: string): LeadEntry[] {
  const separator = "=".repeat(60);
  const blocks = raw.split(separator).map(s => s.trim()).filter(Boolean);

  const entries: LeadEntry[] = [];
  for (let i = 0; i + 1 < blocks.length; i += 2) {
    const timestamp = blocks[i];
    const transcript = blocks[i + 1];
    if (timestamp && transcript) {
      entries.push({ timestamp, transcript });
    }
  }
  return entries.reverse(); // newest first
}

export async function GET() {
  const session = await auth();
  if (!session) return err("Unauthorized.", 401);

  const logPath = path.join(process.cwd(), "leads.log");

  if (!fs.existsSync(logPath)) {
    return Response.json({ success: true, data: { entries: [], total: 0 } });
  }

  const raw = fs.readFileSync(logPath, "utf8");
  const entries = parseLeadsLog(raw);

  return Response.json({ success: true, data: { entries, total: entries.length } });
}
