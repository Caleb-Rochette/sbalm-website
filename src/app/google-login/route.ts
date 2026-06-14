// CRM ONLY — initiates Google OAuth via a top-level GET navigation.
// A plain link here (vs client-side signIn fetch) avoids the cross-origin
// CORS preflight that blocked the in-page fetch. signIn() sets the OAuth
// state cookies and redirects the browser to Google.
import { signIn } from "@/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  // signIn throws a redirect (to Google), which Next turns into the response.
  await signIn("google", { redirectTo: "/crm/dashboard" });
  // Unreachable fallback to satisfy the route's return type.
  return new Response(null, { status: 302, headers: { Location: "/crm/login" } });
}
