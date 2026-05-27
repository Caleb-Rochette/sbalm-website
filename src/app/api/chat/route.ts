import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { Resend } from "resend";
import fs from "fs";
import path from "path";
import { addLead } from "@/lib/crm-store";
import { prisma } from "@/lib/crm/db";

export const runtime = "nodejs";

const SYSTEM_PROMPT = `You are the friendly virtual assistant for Sir Box a Lot Movers, a labor-only moving company based in Gig Harbor, WA. Your job is to help potential customers, answer their questions, and collect their contact info so Daryl can follow up.

ABOUT THE COMPANY:
- Labor-only movers: they provide the crew, customers rent the truck (U-Haul, Penske, Budget, etc.)
- Based in Gig Harbor, WA
- Tagline: "Strong backs. Careful hands. We hustle."
- Phone: 253-523-3755
- Email: daryl@sirboxalotmovers.com
- Free estimates available by phone

PRICING:
- 2-Man Crew: $125/hr — ideal for studios, 1BR, and 2BR homes
- 3-Man Crew: $175/hr — recommended for 3BR+ homes, heavy items, or tight timelines
- 2-hour minimum on all jobs
- After the first 2 hours, billing is in 15-minute increments
- No extra travel charges within service area. You pay for labor time only.
- Not sure which crew size? Recommend they call for a quick chat.

SERVICES:
Core service — Loading & Unloading:
- Professional loading and unloading of all furniture and boxes
- Furniture padding and wrapping with moving blankets and straps
- Floor and doorway protection at both locations
- Strategic truck loading to prevent shifting during transit
- Appliance handling: washers, dryers, refrigerators
- Disassembly and reassembly of basic furniture (included)
- Stair carries at no extra charge

Packing Services:
- Coming soon / details being finalized — not yet fully available
- If asked, say: "Packing services are something we're working on adding — give us a call at 253-523-3755 to ask about current availability."

HOW IT WORKS:
1. Customer rents a truck (U-Haul, Penske, Budget, etc.) — Sir Box a Lot can help advise on size if needed
2. Crew shows up on time, padded and ready to work
3. Customer pays only for labor time — 2-hr minimum, then 15-min increments

SERVICE AREA:
Pierce County (home base — they know the roads and neighborhoods):
Gig Harbor, Tacoma, Puyallup, Lakewood, University Place, Fife, Milton, Edgewood, Bonney Lake, Sumner, Orting, Eatonville, Graham, Spanaway

King County (south King County corridor):
Federal Way, Auburn, Kent, Renton, Burien, Des Moines, SeaTac, Tukwila, Covington, Maple Valley, Black Diamond, Enumclaw

Kitsap County (via Tacoma Narrows Bridge; ferry access may be available — call to confirm):
Bremerton, Belfair, Port Orchard, Silverdale, Poulsbo, Kingston, Olalla, Gorst, Seabeck, Keyport

If a customer mentions a city not on this list, tell them to call — the crew may still be able to help.

BOOKING TIPS:
- Weekends book up fast, especially at the start and end of the month
- Recommend booking at least a week out when possible
- Free estimates by phone

FREQUENTLY ASKED QUESTIONS:
Q: Do you provide the truck?
A: No — labor only. Customer rents the truck (U-Haul, Penske, Budget, etc.), the crew handles all the loading and unloading.

Q: What's the minimum charge?
A: 2-hour minimum. After that, billing is in 15-minute increments.

Q: Are there any surprise charges?
A: Never. You pay for labor time — that's it. If you'd like us to arrange the truck, we can do that too, and any rental cost passes straight through at no markup.

Q: Which crew size should I book?
A: 2-man crew works well for studios through 2BRs. 3-man crew is recommended for 3BR+ homes, heavy items, or tight timelines. When in doubt, call and they'll help figure it out.

Q: Do you charge for stairs?
A: No extra charge for stair carries.

Q: Do you disassemble/reassemble furniture?
A: Yes — basic disassembly and reassembly is included.

Q: Do you handle appliances?
A: Yes — washers, dryers, refrigerators, and other appliances.

Q: What areas do you serve?
A: Pierce, King, and Kitsap counties. Based in Gig Harbor.

Q: Can you help me figure out what size truck to rent?
A: Yes — they're happy to help. Recommend calling 253-523-3755 for a quick chat.

Q: How far in advance should I book?
A: At least a week out is recommended. Weekends fill up fast, especially start/end of month.

YOUR GOAL:
1. Answer questions warmly and helpfully — keep it conversational and brief (2-3 sentences max per reply)
2. Naturally guide the conversation toward collecting: name, phone number or email, move date, and what they need help with
3. Once you have their name + at least one contact method (phone or email) + a general idea of what they need, say exactly this on its own line: ##LEAD_CAPTURED##
4. After ##LEAD_CAPTURED##, tell them Daryl will reach out shortly and offer the phone number if they need a faster reply

TONE: Friendly, confident, direct. Like a helpful neighbor who happens to run a moving company. No corporate speak.

IMPORTANT:
- Never make up prices beyond what's listed above
- If asked about something you don't know, say you're not sure and suggest calling 253-523-3755
- Keep replies short — this is a chat widget, not an essay
- Don't ask for all info at once; collect it naturally through conversation`;

function esc(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;");
}

// Rate limit: 30 messages per IP per 10 min
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + 10 * 60 * 1000 });
    return false;
  }
  if (entry.count >= 30) return true;
  entry.count++;
  return false;
}

type Msg = { role: string; content: string };

function cap(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
}

function extractLeadInfo(messages: Msg[]) {
  const allText = messages.map(m => m.content).join(" ");

  const emailMatch = allText.match(/[\w.+-]+@[\w.-]+\.[a-zA-Z]{2,}/);
  const email = emailMatch?.[0] ?? null;

  const phoneMatch = allText.match(/\b(\+?1[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b/);
  const rawPhone = phoneMatch?.[0]?.replace(/\D/g, "").replace(/^1/, "") ?? null;
  const phone = rawPhone ? `${rawPhone.slice(0,3)}-${rawPhone.slice(3,6)}-${rawPhone.slice(6)}` : null;

  let firstName = "Chat";
  let lastName  = "Lead";

  // Strategy 1: explicit intro pattern anywhere — "my name is X [Y]", "I'm X", "call me X"
  const introMatch = allText.match(
    /(?:my name(?:'s)? is|i(?:'m| am)|this is|call me)\s+([A-Za-z'-]+)(?:\s+([A-Za-z'-]+))?/i
  );
  if (introMatch) {
    firstName = cap(introMatch[1]);
    if (introMatch[2]) lastName = cap(introMatch[2]);
    return { firstName, lastName, email, phone };
  }

  // Strategy 2: user message right after AI asks for their name
  for (let i = 0; i < messages.length - 1; i++) {
    const cur = messages[i];
    const nxt = messages[i + 1];
    if (cur.role !== "assistant" || nxt.role !== "user") continue;
    if (!/\bname\b/i.test(cur.content) || !/\?/.test(cur.content)) continue;
    const words = nxt.content.trim().split(/\s+/);
    if (words.length >= 1 && words.length <= 3 && words.every(w => /^[A-Za-z'-]{2,}$/.test(w))) {
      firstName = cap(words[0]);
      if (words.length >= 2) lastName = cap(words[words.length - 1]);
      return { firstName, lastName, email, phone };
    }
  }

  // Strategy 3: any user message that is exactly 2 name-like words (case-insensitive)
  for (const msg of messages) {
    if (msg.role !== "user") continue;
    const trimmed = msg.content.trim();
    const m = trimmed.match(/^([A-Za-z'-]{2,})\s+([A-Za-z'-]{2,})$/);
    if (m) { firstName = cap(m[1]); lastName = cap(m[2]); break; }
  }

  return { firstName, lastName, email, phone };
}

async function saveLeadToCRM(messages: Msg[], transcript: string) {
  try {
    const { firstName, lastName, email, phone } = extractLeadInfo(messages);

    // Need a user ID for the interaction — use the first admin account
    const admin = await prisma.user.findFirst({
      where: { role: "ADMIN" },
      orderBy: { createdAt: "asc" },
      select: { id: true },
    });

    const customer = await prisma.customer.create({
      data: {
        firstName,
        lastName,
        email,
        phone,
        source: "WEBSITE_CHAT",
        status: "LEAD",
        notes: `Chat transcript:\n\n${transcript}`,
      },
    });

    // Create an interaction so the lead appears in Recent Activity on the dashboard
    if (admin) {
      const contactInfo = [email, phone].filter(Boolean).join(", ");
      await prisma.interaction.create({
        data: {
          customerId:  customer.id,
          type:        "NOTE",
          summary:     `Lead captured via website chat.${contactInfo ? ` Contact: ${contactInfo}.` : ""}`,
          createdById: admin.id,
        },
      });
    }
  } catch (e) {
    console.error("CRM lead save error:", e);
  }
}

function saveLeadToFile(transcript: string) {
  try {
    const logFile = path.join(process.cwd(), "leads.log");
    const entry = `\n${"=".repeat(60)}\n${new Date().toISOString()}\n${"=".repeat(60)}\n${transcript}\n`;
    fs.appendFileSync(logFile, entry, { encoding: "utf8", mode: 0o600 });
  } catch (e) {
    console.error("Lead file save error:", e);
  }
}

async function sendLeadEmail(transcript: string) {
  const toEmail = process.env.RESEND_TO_EMAIL;
  const fromEmail = process.env.RESEND_FROM_EMAIL ?? "onboarding@resend.dev";
  if (!toEmail) return;

  const resend = new Resend(process.env.RESEND_API_KEY);
  const safeTranscript = esc(transcript);

  await resend.emails.send({
    from: fromEmail,
    to: toEmail,
    subject: "🎯 New Chat Lead — Sir Box a Lot",
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;color:#111827;">
        <div style="background:#0F1E32;padding:20px 28px;border-radius:10px 10px 0 0;">
          <h2 style="color:#EB4100;margin:0;font-size:18px;">🎯 New Lead from Chat Widget</h2>
          <p style="color:#A8B8CC;margin:4px 0 0;font-size:13px;">Sir Box a Lot — sirboxalotmovers.com</p>
        </div>
        <div style="background:#fff;padding:28px;border:1px solid #e5e7eb;border-top:none;border-radius:0 0 10px 10px;">
          <p style="color:#374151;font-size:14px;margin:0 0 16px;">A visitor provided their contact info through the AI chat. Full conversation below:</p>
          <div style="background:#F9FAFB;border:1px solid #e5e7eb;border-radius:8px;padding:16px;font-size:13px;line-height:1.7;white-space:pre-wrap;color:#374151;">${safeTranscript}</div>
        </div>
      </div>
    `,
  });
}

export async function POST(req: NextRequest) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "unknown";

  if (isRateLimited(ip)) {
    return NextResponse.json({ error: "Too many messages. Please call 253-523-3755." }, { status: 429 });
  }

  let messages: { role: "user" | "assistant"; content: string }[];
  try {
    ({ messages } = await req.json());
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  if (!Array.isArray(messages) || messages.length === 0 || messages.length > 40) {
    return NextResponse.json({ error: "Invalid messages." }, { status: 400 });
  }

  // Sanitize message content
  const sanitized = messages.map((m) => ({
    role: m.role,
    content: String(m.content).slice(0, 2000),
  }));

  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  let reply: string;
  try {
    const response = await anthropic.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 300,
      system: SYSTEM_PROMPT,
      messages: sanitized,
    });
    reply = (response.content[0] as { type: string; text: string }).text ?? "";
  } catch (err) {
    console.error("Anthropic error:", err);
    return NextResponse.json(
      { error: "AI unavailable. Please call us at 253-523-3755." },
      { status: 500 }
    );
  }

  // Check if lead was captured; fire email and strip the sentinel
  const leadCaptured = reply.includes("##LEAD_CAPTURED##");
  const cleanReply = reply.replace("##LEAD_CAPTURED##", "").trim();

  if (leadCaptured) {
    const transcript = sanitized
      .map((m) => `${m.role === "user" ? "Visitor" : "Assistant"}: ${m.content}`)
      .join("\n") + `\nAssistant: ${cleanReply}`;
    saveLeadToFile(transcript);
    addLead(transcript);
    saveLeadToCRM(sanitized, transcript).catch((e) => console.error("CRM lead error:", e));
    sendLeadEmail(transcript).catch((e) => console.error("Lead email error:", e));
  }

  return NextResponse.json({ reply: cleanReply, leadCaptured });
}
