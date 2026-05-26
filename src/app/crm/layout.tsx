// CRM ONLY — separate from public site layout
import { auth } from "@/auth";
import CRMShell from "@/components/crm/CRMShell";

export default async function CRMLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session) return <>{children}</>;
  return <CRMShell user={session.user}>{children}</CRMShell>;
}
