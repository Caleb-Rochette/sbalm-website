import type { Metadata } from "next";
import { Archivo, Inter } from "next/font/google";
import "./globals.css";
import SiteShell from "@/components/SiteShell";

const archivo = Archivo({
  subsets: ["latin"],
  variable: "--font-archivo",
  weight: ["400", "600", "700", "800", "900"],
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Sir Box a Lot Movers | Labor-Only Moving in Gig Harbor, WA",
    template: "%s | Sir Box a Lot Movers",
  },
  description:
    "Labor-only movers serving Pierce, King, and Kitsap counties. Strong backs, careful hands — we hustle. 2-man crew from $125/hr. Based in Gig Harbor, WA.",
  keywords: [
    "moving company",
    "labor only movers",
    "Gig Harbor movers",
    "Pierce County moving",
    "King County moving",
    "Kitsap County moving",
    "loading unloading",
    "Sir Box a Lot",
    "sirboxalotmovers.com",
  ],
  authors: [{ name: "Sir Box a Lot Movers" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Sir Box a Lot Movers",
    title: "Sir Box a Lot Movers | Labor-Only Moving in Gig Harbor, WA",
    description:
      "Strong backs. Careful hands. We hustle. Labor-only moving serving Pierce, King, and Kitsap counties from $125/hr.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sir Box a Lot Movers",
    description: "Strong backs. Careful hands. We hustle.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${archivo.variable} ${inter.variable}`}>
      <body className="font-body antialiased bg-brand-cream text-brand-dark">
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
