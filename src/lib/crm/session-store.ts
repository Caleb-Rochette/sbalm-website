// Short-lived nonce store for the login → session cookie handoff.
// One-time use, 60-second TTL. Lives only for the lifetime of this process.
const pending = new Map<string, { token: string; exp: number }>();

export function storePendingSession(token: string): string {
  const nonce = crypto.randomUUID();
  pending.set(nonce, { token, exp: Date.now() + 60_000 });
  if (pending.size > 200) {
    const now = Date.now();
    pending.forEach((v, k) => { if (v.exp < now) pending.delete(k); });
  }
  return nonce;
}

export function consumePendingSession(nonce: string): string | null {
  const entry = pending.get(nonce);
  if (!entry || entry.exp < Date.now()) return null;
  pending.delete(nonce);
  return entry.token;
}
