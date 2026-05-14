import Link from "next/link";
import Image from "next/image";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/about", label: "About" },
  { href: "/service-area", label: "Service Area" },
  { href: "/contact", label: "Contact" },
];

export default function Footer() {
  return (
    <footer className="bg-brand-navy text-blue-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand */}
          <div className="flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-3">
              {/* TODO: Replace with logo.png when the final logo asset is provided */}
              <div className="w-10 h-10 bg-brand-orange rounded overflow-hidden shrink-0">
                <Image
                  src="/mascot.jpg"
                  alt="Sir Box a Lot Movers mascot"
                  width={40}
                  height={40}
                  className="object-cover w-full h-full"
                />
              </div>
              <span className="font-heading font-bold text-white text-lg">
                Sir Box a Lot Movers
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-brand-mist">
              Strong backs. Careful hands. We hustle. Labor-only movers serving
              Pierce, King, and Kitsap counties.
            </p>
            {/* TODO: Add real social links when accounts are created */}
            <div className="flex gap-3">
              <a
                href="#"
                aria-label="Facebook"
                className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center hover:bg-brand-orange transition-colors text-sm font-bold"
              >
                f
              </a>
              <a
                href="#"
                aria-label="Instagram"
                className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center hover:bg-brand-orange transition-colors text-xs font-bold"
              >
                ig
              </a>
              <a
                href="#"
                aria-label="Google"
                className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center hover:bg-brand-orange transition-colors text-sm font-bold"
              >
                G
              </a>
            </div>
          </div>

          {/* Nav */}
          <div>
            <h3 className="font-heading font-bold text-white mb-4 text-sm uppercase tracking-widest">
              Pages
            </h3>
            <nav className="flex flex-col gap-2">
              {navLinks.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className="text-sm text-brand-mist hover:text-white transition-colors"
                >
                  {label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-heading font-bold text-white mb-4 text-sm uppercase tracking-widest">
              Contact
            </h3>
            <address className="not-italic flex flex-col gap-3 text-sm">
              <div>
                <p className="font-semibold text-white">Phone</p>
                <a href="tel:2535233755" className="text-brand-mist hover:text-brand-orange transition-colors">
                  📞 253-523-3755
                </a>
              </div>
              <div>
                <p className="font-semibold text-white">Email</p>
                <a href="mailto:daryl@sirboxalotmovers.com" className="text-brand-mist hover:text-brand-orange transition-colors">
                  daryl@sirboxalotmovers.com
                </a>
              </div>
              <div>
                <p className="font-semibold text-white">Address</p>
                <p className="text-brand-mist">5302 58th St NW</p>
                <p className="text-brand-mist">Gig Harbor, WA 98335</p>
              </div>
            </address>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-brand-mist">
          <p>© {new Date().getFullYear()} Sir Box a Lot Movers LLC. All rights reserved.</p>
          <div className="flex gap-6">
            {/* TODO: Create /privacy and /terms pages */}
            <Link href="/privacy" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-white transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
