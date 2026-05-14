"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/about", label: "About" },
  { href: "/service-area", label: "Service Area" },
  { href: "/contact", label: "Contact" },
];

export default function Nav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 bg-brand-navy shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-40 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 shrink-0">
          <div className="w-36 h-36 bg-brand-orange rounded overflow-hidden flex items-center justify-center">
            {/* TODO: Replace src with /logo.png when the final logo asset is provided */}
            <Image
              src="/mascot.jpg"
              alt="Sir Box a Lot Movers — knight mascot"
              width={144}
              height={144}
              className="object-cover w-full h-full"
            />
          </div>
          <span className="font-heading font-bold text-white text-lg leading-tight hidden sm:block">
            Sir Box a Lot
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6">
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`text-sm font-medium transition-colors ${
                pathname === href
                  ? "text-brand-orange"
                  : "text-blue-100 hover:text-white"
              }`}
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Desktop phone CTA */}
        <a
          href="tel:2535233755"
          className="hidden md:inline-flex items-center gap-2 bg-brand-orange text-white font-bold px-4 py-2 rounded-lg text-sm hover:bg-brand-ember transition-colors"
        >
          <span>📞</span>
          <span>253-523-3755</span>
        </a>

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-white p-2 rounded-lg hover:bg-white/10 transition-colors"
          onClick={() => setOpen(!open)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {open ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="md:hidden bg-brand-navyLight border-t border-white/10 px-4 pb-4">
          <nav className="flex flex-col gap-1 pt-3">
            {links.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className={`py-2.5 px-3 rounded-lg text-sm font-medium transition-colors ${
                  pathname === href
                    ? "bg-white/10 text-brand-orange"
                    : "text-blue-100 hover:bg-white/10 hover:text-white"
                }`}
              >
                {label}
              </Link>
            ))}
            <a
              href="tel:2535233755"
              className="mt-3 flex items-center justify-center gap-2 bg-brand-orange text-white font-bold py-3 rounded-lg text-sm hover:bg-brand-ember transition-colors"
            >
              <span>📞</span>
              <span>253-523-3755</span>
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
