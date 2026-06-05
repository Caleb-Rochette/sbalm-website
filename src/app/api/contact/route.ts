import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { prisma } from "@/lib/crm/db";

export const runtime = "nodejs";

interface ContactPayload {
  name: string;
  phone: string;
  email: string;
  moveDate: string;
  moveSize: string;
  serviceType: string;
  message?: string;
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;");
}

// In-memory rate limit: max 3 submissions per IP per 10 minutes
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 3;
const RATE_WINDOW_MS = 10 * 60 * 1000;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return false;
  }
  if (entry.count >= RATE_LIMIT) return true;
  entry.count++;
  return false;
}

function splitName(full: string): { firstName: string; lastName: string } {
  const parts = full.trim().split(/\s+/);
  return {
    firstName: parts[0] || "Website",
    lastName: parts.length > 1 ? parts.slice(1).join(" ") : "Lead",
  };
}

async function saveLeadToCRM(p: {
  name: string;
  phone: string;
  email: string;
  moveDate: string;
  moveSize: string;
  serviceType: string;
  message?: string;
}) {
  const { firstName, lastName } = splitName(p.name);
  const notes = [
    "Quote request via website form.",
    `Move date: ${p.moveDate}`,
    `Home size: ${p.moveSize}`,
    `Service needed: ${p.serviceType}`,
    p.message?.trim() ? `Notes: ${p.message.trim()}` : null,
  ]
    .filter(Boolean)
    .join("\n");

  const customer = await prisma.customer.create({
    data: {
      firstName,
      lastName,
      email: p.email.trim() || null,
      phone: p.phone.trim() || null,
      source: "WEBSITE_FORM",
      status: "LEAD",
      notes,
    },
  });

  // Attach an interaction so the lead surfaces in Recent Activity on the dashboard.
  const admin = await prisma.user.findFirst({
    where: { role: "ADMIN" },
    orderBy: { createdAt: "asc" },
    select: { id: true },
  });
  if (admin) {
    await prisma.interaction.create({
      data: {
        customerId: customer.id,
        type: "NOTE",
        summary: `New quote request via website form — ${p.moveSize}, move date ${p.moveDate}.`,
        createdById: admin.id,
      },
    });
  }
}

export async function POST(req: NextRequest) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "unknown";

  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later or call us at 253-523-3755." },
      { status: 429 }
    );
  }

  let body: ContactPayload;

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { name, phone, email, moveDate, moveSize, serviceType, message } = body;

  // Server-side validation
  if (!name?.trim() || !phone?.trim() || !email?.trim() || !moveDate || !moveSize || !serviceType) {
    return NextResponse.json({ error: "All required fields must be filled in." }, { status: 400 });
  }

  if (!isValidEmail(email)) {
    return NextResponse.json({ error: "Please provide a valid email address." }, { status: 400 });
  }

  const toEmail = process.env.RESEND_TO_EMAIL;
  const fromEmail = process.env.RESEND_FROM_EMAIL ?? "onboarding@resend.dev";
  // Initialized lazily so the build doesn't fail when RESEND_API_KEY isn't set
  const resend = new Resend(process.env.RESEND_API_KEY);

  if (!toEmail) {
    console.error("RESEND_TO_EMAIL environment variable is not set.");
    return NextResponse.json(
      { error: "Server configuration error. Please call us directly at 253-523-3755." },
      { status: 500 }
    );
  }

  const formattedDate = new Date(moveDate + "T00:00:00").toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const safeName        = esc(name.trim());
  const safeFirstName   = esc(splitName(name).firstName);
  const safePhone       = esc(phone.trim());
  const safeEmail       = esc(email.trim());
  const safeMoveSize    = esc(moveSize);
  const safeServiceType = esc(serviceType);
  const safeMessage     = message?.trim() ? esc(message.trim()) : "";
  const safeDate        = esc(formattedDate);
  const phoneDigits     = phone.replace(/\D/g, "").replace(/[^0-9]/g, "");

  try {
    await resend.emails.send({
      from: fromEmail,
      to: toEmail,
      replyTo: email,
      subject: `New Quote Request — ${safeName} (${safeMoveSize}, ${safeDate})`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #111827;">
          <div style="background: #0F2744; padding: 24px 32px; border-radius: 12px 12px 0 0;">
            <h1 style="color: #E8A020; font-size: 22px; margin: 0;">
              New Move Request — Sir Box-a-Lot Movers
            </h1>
          </div>
          <div style="background: #ffffff; padding: 32px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 12px 12px;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #f3f4f6; font-weight: 600; width: 40%; color: #0F2744;">Name</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #f3f4f6;">${safeName}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #f3f4f6; font-weight: 600; color: #0F2744;">Phone</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #f3f4f6;">
                  <a href="tel:${phoneDigits}" style="color: #E8A020;">${safePhone}</a>
                </td>
              </tr>
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #f3f4f6; font-weight: 600; color: #0F2744;">Email</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #f3f4f6;">
                  <a href="mailto:${safeEmail}" style="color: #E8A020;">${safeEmail}</a>
                </td>
              </tr>
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #f3f4f6; font-weight: 600; color: #0F2744;">Move Date</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #f3f4f6;">${safeDate}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #f3f4f6; font-weight: 600; color: #0F2744;">Home Size</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #f3f4f6;">${safeMoveSize}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #f3f4f6; font-weight: 600; color: #0F2744;">Service Needed</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #f3f4f6;">${safeServiceType}</td>
              </tr>
              ${
                safeMessage
                  ? `<tr>
                      <td style="padding: 10px 0; font-weight: 600; vertical-align: top; color: #0F2744;">Notes</td>
                      <td style="padding: 10px 0; white-space: pre-wrap;">${safeMessage}</td>
                    </tr>`
                  : ""
              }
            </table>
            <div style="margin-top: 24px; padding: 16px; background: #FDF8F0; border-radius: 8px; font-size: 13px; color: #6B7280;">
              Reply to this email to respond directly to ${safeName}.
            </div>
          </div>
        </div>
      `,
    });

  } catch (err) {
    console.error("Resend error:", err);
    return NextResponse.json(
      { error: "Failed to send your message. Please call us at 253-523-3755." },
      { status: 500 }
    );
  }

  // Instant confirmation to the customer (autoresponder). Non-fatal — a failure
  // here must never break the lead or the visitor's success screen.
  try {
    await resend.emails.send({
      from: fromEmail,
      to: email,
      replyTo: toEmail,
      subject: "We got your request — Sir Box a Lot Movers",
      html: `
        <div style="font-family:-apple-system,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;max-width:560px;margin:0 auto;color:#1f2937;">
          <div style="background:#0F1E32;padding:28px 32px;border-radius:12px 12px 0 0;text-align:center;">
            <h1 style="color:#ffffff;font-size:20px;margin:0;">Sir Box a Lot <span style="color:#EB4100;">Movers</span></h1>
          </div>
          <div style="background:#ffffff;padding:32px;border:1px solid #e5e7eb;border-top:none;">
            <p style="font-size:16px;margin:0 0 16px;">Hi ${safeFirstName},</p>
            <p style="font-size:15px;line-height:1.6;margin:0 0 16px;">
              Thanks for reaching out! We&rsquo;ve received your request and a member of our crew
              will get back to you <strong>within a few hours</strong> (during business hours) to
              go over the details and get you a quote.
            </p>
            <div style="background:#FAF7F2;border:1px solid #E8E4DE;border-radius:10px;padding:16px 20px;margin:20px 0;">
              <p style="font-size:12px;text-transform:uppercase;letter-spacing:0.05em;color:#8A8580;margin:0 0 10px;">Your request</p>
              <table style="width:100%;border-collapse:collapse;font-size:14px;">
                <tr><td style="padding:4px 0;color:#6b7280;">Move date</td><td style="padding:4px 0;text-align:right;font-weight:600;">${safeDate}</td></tr>
                <tr><td style="padding:4px 0;color:#6b7280;">Home size</td><td style="padding:4px 0;text-align:right;font-weight:600;">${safeMoveSize}</td></tr>
                <tr><td style="padding:4px 0;color:#6b7280;">Service</td><td style="padding:4px 0;text-align:right;font-weight:600;">${safeServiceType}</td></tr>
              </table>
            </div>
            <p style="font-size:15px;line-height:1.6;margin:0 0 10px;">Need us sooner, or have a question? Call or text anytime:</p>
            <p style="margin:0 0 24px;">
              <a href="tel:2535233755" style="display:inline-block;background:#EB4100;color:#ffffff;text-decoration:none;font-weight:700;padding:12px 24px;border-radius:10px;font-size:15px;">📞 253-523-3755</a>
            </p>
            <p style="font-size:15px;line-height:1.6;margin:0;">Talk soon,<br/><strong>The Sir Box a Lot crew</strong></p>
          </div>
          <div style="text-align:center;padding:16px;font-size:12px;color:#9ca3af;">
            Sir Box a Lot Movers &middot; Gig Harbor, WA &middot; Serving Pierce, King &amp; Kitsap counties
          </div>
        </div>
      `,
    });
  } catch (e) {
    console.error("Autoresponder send error (contact form):", e);
  }

  // Email sent — now record the lead in the CRM. Non-fatal: a DB hiccup must
  // never make the visitor think their submission failed.
  try {
    await saveLeadToCRM({ name, phone, email, moveDate, moveSize, serviceType, message });
  } catch (e) {
    console.error("CRM lead save error (contact form):", e);
  }

  return NextResponse.json({ success: true }, { status: 200 });
}
