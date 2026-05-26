// CRM ONLY
import { auth } from "@/auth";
import { prisma } from "@/lib/crm/db";
import SettingsForm from "./SettingsForm";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Settings — Sir Box a Lot CRM" };
export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  await auth();

  const settings = await prisma.businessSettings.upsert({
    where: { id: 1 },
    update: {},
    create: { id: 1, rate2ManCrew: 125, rate3ManCrew: 175, minimumHours: 2 },
  });

  return (
    <div className="p-6 max-w-xl mx-auto">
      <div className="mb-6">
        <h1 className="font-heading font-extrabold text-2xl text-brand-navy">Settings</h1>
        <p className="text-gray-400 text-sm mt-0.5">Business rates and default configuration</p>
      </div>
      <SettingsForm settings={settings} />
    </div>
  );
}
