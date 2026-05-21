import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

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

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error("Resend error:", err);
    return NextResponse.json(
      { error: "Failed to send your message. Please call us at 253-523-3755." },
      { status: 500 }
    );
  }
}
