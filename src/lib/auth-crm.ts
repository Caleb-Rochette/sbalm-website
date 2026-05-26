import crypto from "crypto";
import { cookies } from "next/headers";

const COOKIE = "crm_session";
const TTL = 24 * 60 * 60 * 1000; // 24 hours

function secret(): string {
  return process.env.CRM_SESSION_SECRET ?? "fallback-change-this-in-env";
}

function sign(payload: string): string {
  return crypto.createHmac("sha256", secret()).update(payload).digest("hex");
}

export function createToken(email: string): string {
  const expiry = Date.now() + TTL;
  const payload = `${email}:${expiry}`;
  return Buffer.from(`${payload}:${sign(payload)}`).toString("base64url");
}

export function verifyToken(token: string): string | null {
  try {
    const decoded = Buffer.from(token, "base64url").toString("utf8");
    const lastColon = decoded.lastIndexOf(":");
    const payload = decoded.slice(0, lastColon);
    const hmac = decoded.slice(lastColon + 1);
    const expected = sign(payload);
    if (
      hmac.length !== expected.length ||
      !crypto.timingSafeEqual(Buffer.from(hmac, "hex"), Buffer.from(expected, "hex"))
    )
      return null;
    const colonIdx = payload.lastIndexOf(":");
    const expiry = Number(payload.slice(colonIdx + 1));
    if (Date.now() > expiry) return null;
    return payload.slice(0, colonIdx);
  } catch {
    return null;
  }
}

export function getSession(): string | null {
  const token = cookies().get(COOKIE)?.value;
  if (!token) return null;
  return verifyToken(token);
}

export function verifyCredentials(email: string, password: string): boolean {
  const validEmail = process.env.CRM_EMAIL ?? "daryl@sirboxalotmovers.com";
  const validPassword = process.env.CRM_PASSWORD ?? "";
  if (!validPassword) return false;
  const emailOk = crypto.timingSafeEqual(Buffer.from(email), Buffer.from(validEmail));
  const passOk =
    password.length === validPassword.length &&
    crypto.timingSafeEqual(Buffer.from(password), Buffer.from(validPassword));
  return emailOk && passOk;
}

export { COOKIE, TTL };
