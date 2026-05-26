// CRM ONLY
import { auth } from "@/auth";
import { ok } from "@/lib/crm/utils";
import fs from "fs";
import path from "path";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Chat Leads — Sir Box a Lot CRM" };
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

interface LeadEntry {
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
    if (timestamp && transcript) entries.push({ timestamp, transcript });
  }
  return entries.reverse();
}

function fmtTimestamp(iso: string) {
  try {
    return new Date(iso).toLocaleString("en-US", {
      weekday: "short", month: "short", day: "numeric",
      hour: "numeric", minute: "2-digit", hour12: true,
    });
  } catch { return iso; }
}

function TranscriptLine({ line }: { line: string }) {
  if (line.startsWith("Visitor:")) {
    return (
      <div className="flex gap-2">
        <span className="text-xs font-bold text-brand-orange shrink-0 w-20 pt-0.5">Visitor</span>
        <p className="text-sm text-gray-800">{line.slice("Visitor:".length).trim()}</p>
      </div>
    );
  }
  if (line.startsWith("Assistant:")) {
    return (
      <div className="flex gap-2">
        <span className="text-xs font-bold text-brand-navy shrink-0 w-20 pt-0.5">Bot</span>
        <p className="text-sm text-gray-500">{line.slice("Assistant:".length).trim()}</p>
      </div>
    );
  }
  return null;
}

export default async function LeadsLogPage() {
  await auth();

  const logPath = path.join(process.cwd(), "leads.log");
  const entries: LeadEntry[] = fs.existsSync(logPath)
    ? parseLeadsLog(fs.readFileSync(logPath, "utf8"))
    : [];

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="font-heading font-extrabold text-2xl text-brand-navy">Chat Leads</h1>
        <p className="text-gray-400 text-sm mt-0.5">
          {entries.length} lead{entries.length !== 1 ? "s" : ""} captured from the website chatbot
        </p>
      </div>

      {entries.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-10 text-center">
          <p className="text-gray-400">No leads captured yet.</p>
          <p className="text-gray-300 text-sm mt-1">They&apos;ll appear here once a visitor shares their contact info in the chat.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {entries.map((entry, i) => {
            const lines = entry.transcript.split("\n").filter(Boolean);
            return (
              <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-5 py-3 border-b border-gray-100 flex items-center justify-between bg-gray-50">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-700">
                      Chat Lead
                    </span>
                    <span className="text-sm font-medium text-gray-700">
                      {fmtTimestamp(entry.timestamp)}
                    </span>
                  </div>
                </div>
                <div className="px-5 py-4 space-y-2">
                  {lines.map((line, j) => (
                    <TranscriptLine key={j} line={line} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
