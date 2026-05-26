// CRM ONLY
import { redirect } from "next/navigation";
import { auth } from "@/auth";

export default async function CRMRootPage() {
  const session = await auth();
  redirect(session ? "/crm/dashboard" : "/crm/login");
}
