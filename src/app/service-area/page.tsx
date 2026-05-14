import type { Metadata } from "next";
import Link from "next/link";
import SectionHeader from "@/components/SectionHeader";

export const metadata: Metadata = {
  title: "Service Area",
  description:
    "Sir Box a Lot Movers serves Pierce, King, and Kitsap counties in Washington State. Based in Gig Harbor, WA.",
};

const counties = [
  {
    name: "Pierce County",
    description:
      "Our home base. We know Pierce County roads, neighborhoods, and apartment complexes inside and out.",
    // TODO: Confirm comprehensive city list for Pierce County coverage with owner
    cities: [
      "Gig Harbor", "Tacoma", "Puyallup", "Lakewood", "University Place",
      "Fife", "Milton", "Edgewood", "Bonney Lake", "Sumner",
      "Orting", "Eatonville", "Graham", "Spanaway",
    ],
  },
  {
    name: "King County",
    description:
      "From Federal Way to Auburn and beyond — we cover the south King County corridor and more.",
    // TODO: Confirm exact King County coverage boundary with owner and update city list
    cities: [
      "Federal Way", "Auburn", "Kent", "Renton", "Burien",
      "Des Moines", "SeaTac", "Tukwila", "Covington", "Maple Valley",
      "Black Diamond", "Enumclaw",
    ],
  },
  {
    name: "Kitsap County",
    description:
      "Cross the Narrows or take the ferry — we serve Kitsap communities throughout the peninsula.",
    // TODO: Confirm ferry policy and exact Kitsap coverage boundary with owner before going live
    cities: [
      "Bremerton", "Belfair", "Port Orchard", "Silverdale", "Poulsbo",
      "Kingston", "Olalla", "Gorst", "Seabeck", "Keyport",
    ],
  },
];

export default function ServiceAreaPage() {
  return (
    <>
      {/* ── Hero ── */}
      <section className="bg-brand-navy text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-brand-orange text-sm font-semibold uppercase tracking-widest mb-3">
            Coverage
          </p>
          <h1 className="font-heading text-4xl md:text-5xl font-extrabold">
            We Cover the Puget Sound
          </h1>
          <p className="mt-4 text-brand-mist text-lg max-w-2xl">
            Based in Gig Harbor, we serve movers across Pierce, King, and Kitsap
            counties. If you&apos;re in the South Sound area, chances are we
            come to you.
          </p>
        </div>
      </section>

      {/* ── County Cards ── */}
      <section className="bg-brand-paper py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="Service Area"
            heading="Three Counties. One Crew."
            subheading="We serve the following areas. Don't see your city? Call us — we may still be able to help."
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {counties.map(({ name, description, cities }) => (
              <div
                key={name}
                className="bg-brand-cream rounded-2xl p-8 border border-brand-stoneLight shadow-sm"
              >
                <div className="flex items-center gap-3 mb-4">
                  <span className="w-8 h-8 bg-brand-orange rounded-full flex items-center justify-center text-white text-sm font-bold">
                    ✓
                  </span>
                  <h2 className="font-heading font-bold text-xl text-brand-navy">
                    {name}
                  </h2>
                </div>
                <p className="text-brand-stone text-sm mb-6">{description}</p>
                <h3 className="text-xs font-bold uppercase tracking-widest text-brand-navy mb-3">
                  Cities Served
                </h3>
                <ul className="flex flex-wrap gap-2">
                  {cities.map((city) => (
                    <li
                      key={city}
                      className="bg-brand-paper text-brand-navy text-xs font-medium px-3 py-1.5 rounded-full border border-brand-stoneLight"
                    >
                      {city}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Notes ── */}
      <section className="bg-brand-cream py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="Good to Know"
            heading="Travel &amp; Availability"
            subheading="A few things worth knowing before you book."
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
              {
                icon: "🗺️",
                title: "No Travel Fees Within Our Area",
                body: "We do not charge travel or fuel surcharges for jobs within our standard service area. You pay only for your crew's labor time.",
              },
              {
                icon: "📅",
                title: "Book in Advance",
                body: "Weekends fill up fast, especially at the start and end of the month. We recommend booking at least a week out when possible.",
              },
              {
                icon: "⛴️",
                title: "Ferry & Bridge Access",
                // TODO: Confirm ferry policy with owner before publishing
                body: "We serve Kitsap County via the Tacoma Narrows Bridge. Ferry access may be available — call to confirm for your specific location.",
              },
              {
                icon: "📞",
                title: "Not Sure? Just Call.",
                body: "If you don't see your city listed, give us a call. We're happy to discuss availability for your area.",
              },
            ].map(({ icon, title, body }) => (
              <div key={title} className="bg-brand-paper rounded-xl p-6 border border-brand-stoneLight shadow-sm">
                <div className="text-3xl mb-3">{icon}</div>
                <h3 className="font-heading font-bold text-brand-navy mb-2">{title}</h3>
                <p className="text-brand-stone text-sm leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="bg-brand-navy py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-white">
            Ready to book your move?
          </h2>
          <p className="mt-4 text-brand-mist">
            We serve your area. Let&apos;s get you scheduled.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center bg-brand-orange text-white font-bold py-3 px-8 rounded-xl hover:bg-brand-ember transition-colors"
            >
              Request a Quote
            </Link>
            <a
              href="tel:2535233755"
              className="inline-flex items-center justify-center gap-2 border-2 border-white/30 text-white font-semibold py-3 px-8 rounded-xl hover:border-white hover:bg-white/10 transition-colors"
            >
              📞 253-523-3755
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
