"use client";
// CRM ONLY — sidebar layout. Never imported by public pages.
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ToastProvider } from "./Toast";

const NAV = [
  { href: "/crm/dashboard",    label: "Dashboard",  icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
  { href: "/crm/customers",    label: "Customers",  icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" },
  { href: "/crm/jobs",         label: "Jobs",       icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" },
  { href: "/crm/employees",    label: "Employees",  icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" },
  { href: "/crm/quotes",       label: "Quotes",     icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" },
  { href: "/crm/leads",        label: "Chat Leads", icon: "M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" },
  { href: "/crm/settings",     label: "Settings",   icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z" },
];

export default function CRMShell({ children, user }: {
  children: React.ReactNode;
  user: { name?: string | null; email?: string | null };
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <ToastProvider>
      <div className="flex h-screen bg-gray-50 overflow-hidden">
        {/* Mobile overlay */}
        {open && <div className="fixed inset-0 bg-black/40 z-20 lg:hidden" onClick={() => setOpen(false)} />}

        {/* Sidebar */}
        <aside className={`fixed inset-y-0 left-0 z-30 w-60 bg-brand-navy flex flex-col transform transition-transform duration-200 lg:static lg:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"}`}>
          <div className="px-5 py-5 border-b border-white/10">
            <p className="font-heading font-extrabold text-white text-base leading-none">Sir Box a Lot</p>
            <p className="text-brand-mist text-xs mt-0.5">CRM</p>
          </div>

          <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
            {NAV.map(({ href, label, icon }) => {
              const active = pathname === href || pathname.startsWith(href + "/");
              return (
                <Link key={href} href={href} onClick={() => setOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${active ? "bg-white/10 text-white" : "text-brand-mist hover:bg-white/5 hover:text-white"}`}>
                  <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d={icon} />
                  </svg>
                  {label}
                </Link>
              );
            })}
          </nav>

          <div className="px-4 py-4 border-t border-white/10">
            <p className="text-white text-sm font-semibold truncate">{user.name}</p>
            <p className="text-brand-mist text-xs truncate mb-3">{user.email}</p>
            <button onClick={() => { window.location.href = `/api/logout?t=${Date.now()}`; }}
              className="w-full text-left text-xs text-brand-mist hover:text-white transition-colors">
              Sign out →
            </button>
          </div>
        </aside>

        {/* Main */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          {/* Top bar (mobile) */}
          <div className="lg:hidden bg-brand-navy text-white px-4 py-3 flex items-center gap-3 shrink-0">
            <button onClick={() => setOpen(true)}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <span className="font-heading font-bold text-sm">Sir Box a Lot CRM</span>
          </div>

          <main className="flex-1 overflow-y-auto">{children}</main>
        </div>
      </div>
    </ToastProvider>
  );
}
