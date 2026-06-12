// CRM ONLY
import { auth } from "@/auth";
import { prisma } from "@/lib/crm/db";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Chat Leads — Sir Box a Lot CRM" };
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function fmtTimestamp(date: Date) {
  return date.toLocaleString("en-US", {
    weekday: "short", month: "short", day: "numeric",
    hour: "numeric", minute: "2-digit", hour12: true,
  });
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

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="font-heading font-extrabold text-2xl text-brand-navy">Chat Leads</h1>
        <p className="text-gray-400 text-sm mt-0.5">
          {leads.length} lead{leads.length !== 1 ? "s" : ""} captured from the website chatbot
        </p>
      </div>

      {leads.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-10 text-center">
          <p className="text-gray-400">No leads captured yet.</p>
          <p className="text-gray-300 text-sm mt-1">
            They&apos;ll appear here once a visitor shares their contact info in the chat.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {leads.map((lead) => {
            const transcriptLines = (lead.notes ?? "")
              .split("\n")
              .filter((l) => l.startsWith("Visitor:") || l.startsWith("Assistant:"));
            const contactLine = [lead.phone, lead.email].filter(Boolean).join(" · ");

            return (
              <div key={lead.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-5 py-3 border-b border-gray-100 flex items-center justify-between bg-gray-50">
                  <div className="flex items-center gap-3">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-700">
                      Chat Lead
                    </span>
                    <span className="text-sm font-medium text-gray-700">
                      {lead.firstName} {lead.lastName}
                    </span>
                    {contactLine && (
                      <span className="text-xs text-gray-400">{contactLine}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-400">{fmtTimestamp(lead.createdAt)}</span>
                    <Link
                      href={`/crm/customers/${lead.id}`}
                      className="text-xs text-brand-navy hover:underline font-medium"
                    >
                      View in CRM →
                    </Link>
                  </div>
                </div>
                {transcriptLines.length > 0 && (
                  <div className="px-5 py-4 space-y-2">
                    {transcriptLines.map((line, j) => (
                      <TranscriptLine key={j} line={line} />
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
