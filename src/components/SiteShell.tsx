"use client";
import { usePathname } from "next/navigation";
import Nav from "./Nav";
import Footer from "./Footer";
import ChatWidget from "./ChatWidget";

export default function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isCRM = pathname.startsWith("/crm");
  return (
    <>
      {!isCRM && <Nav />}
      <main>{children}</main>
      {!isCRM && <Footer />}
      {!isCRM && <ChatWidget />}
    </>
  );
}
