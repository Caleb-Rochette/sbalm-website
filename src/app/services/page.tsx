import type { Metadata } from "next";
import Link from "next/link";
import PricingCard from "@/components/PricingCard";
import SectionHeader from "@/components/SectionHeader";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Full-service local moving in Pierce, King, and Kitsap counties. We bring the truck, wrap and pad your furniture, disassemble and reassemble, and handle loading, transport, and unloading.",
};

export default function ServicesPage() {
  return (
    <>
      {/* ── Page Hero ── */}
      <section className="bg-brand-cream text-brand-navy py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-brand-orange text-sm font-semibold uppercase tracking-widest mb-3">
            What We Do
          </p>
          <h1 className="font-heading text-4xl md:text-5xl font-extrabold">
            Our Services
          </h1>
          <p className="mt-4 text-brand-stoneDark text-lg max-w-2xl">
            From the truck to the last box, we take care of every detail.
            Here&apos;s exactly what we bring to every job.
          </p>
        </div>
      </section>

      {/* ── Services ── */}
      <section className="bg-brand-paper py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="Services"
            heading="How We Help You Move"
            centered={false}
          />

          {/* Loading & Unloading */}
          <div className="mt-8 bg-brand-cream rounded-2xl p-8 md:p-12 border border-brand-stoneLight shadow-sm">
            <div className="flex items-start gap-5 mb-6">
              <div className="w-14 h-14 bg-brand-navy rounded-xl flex items-center justify-center text-2xl shrink-0">
                🚛
              </div>
              <div>
                <h2 className="font-heading text-2xl font-bold text-brand-navy">
                  Full-Service Local Moving
                </h2>
                <p className="text-brand-orange text-sm font-semibold mt-1">
                  Our core service — every detail handled
                </p>
              </div>
            </div>
            <p className="text-brand-stoneDark leading-relaxed mb-6">
              We handle your entire local move from start to finish. We bring the
              rental truck, the moving blankets, the shrink wrap, and the tools —
              then pad, wrap, load, transport, and unload with care, protecting
              your home and belongings every step of the way.
            </p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
              {[
                "Rental truck arranged and driven for you",
                "Moving blankets and shrink wrap on every job",
                "Professional loading of all furniture and boxes",
                "Careful furniture padding and wrapping",
                "Disassembly and reassembly of your furniture",
                "Floor and doorway protection at both homes",
                "Strategic loading to prevent shifting in transit",
                "Appliance handling (washers, dryers, refrigerators)",
                "Unloading and placement in your new home",
                "Stair carries at no extra charge",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-brand-stoneDark">
                  <span className="text-brand-orange font-bold shrink-0 mt-0.5">✓</span>
                  {item}
                </li>
              ))}
            </ul>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center bg-brand-orange text-white font-bold py-3 px-8 rounded-xl hover:bg-brand-ember transition-colors"
            >
              Book Your Move
            </Link>
          </div>

          {/* Packing Services — TODO */}
          {/*
            TODO: Fill in packing service details with the owner once the packing offer is finalized.
            Include: materials list (boxes, tape, packing paper, bubble wrap),
            whether materials are provided by crew or purchased separately,
            partial vs. full-home packing options, and any upsell to loading.
            Brand doc notes this as "service expansion language TBD."
          */}
          <div className="mt-8 bg-brand-paper rounded-2xl p-8 md:p-12 border-2 border-dashed border-brand-stoneLight">
            <div className="flex items-start gap-5 mb-6">
              <div className="w-14 h-14 bg-brand-fog rounded-xl flex items-center justify-center text-2xl shrink-0">
                📦
              </div>
              <div>
                <h2 className="font-heading text-2xl font-bold text-brand-navy">
                  Packing Services
                </h2>
                <p className="text-brand-stone text-sm font-semibold mt-1">
                  Coming soon — details being finalized
                </p>
              </div>
            </div>
            <p className="text-brand-stone leading-relaxed mb-4">
              Our crew can handle professional packing so you can focus on
              everything else your move demands. We treat fragile items,
              artwork, and everyday goods with equal care.
            </p>
            <p className="text-sm text-brand-mist italic">
              Full details including materials, pricing, and booking will be
              available soon. Call us to ask about current availability.
            </p>
            <a
              href="tel:2535233755"
              className="mt-6 inline-flex items-center gap-2 text-brand-orange font-semibold hover:underline"
            >
              📞 Call to inquire: 253-523-3755
            </a>
          </div>
        </div>
      </section>

      {/* ── Pricing ── */}
      <section className="bg-brand-cream py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="Pricing"
            heading="Simple, Honest Rates"
            subheading="A 2-hour minimum on every job — no hidden fees."
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            <PricingCard
              crew="2-Man Crew"
              rate="$139"
              features={[
                "2 professional movers",
                "2-hour minimum",
                "Loading, transport & unloading",
                "Moving blankets & shrink wrap",
                "Furniture disassembly & reassembly",
              ]}
            />
            <PricingCard
              crew="3-Man Crew"
              rate="$189"
              highlight
              features={[
                "3 professional movers",
                "2-hour minimum",
                "Loading, transport & unloading",
                "Moving blankets & shrink wrap",
                "Furniture disassembly & reassembly",
                "Faster for 3BR+ homes",
              ]}
            />
          </div>

          {/* FAQ */}
          <div className="mt-12 bg-brand-paper rounded-2xl p-8 border border-brand-stoneLight max-w-3xl mx-auto">
            <h3 className="font-heading font-bold text-brand-navy text-xl mb-4">
              Frequently Asked Questions
            </h3>
            <dl className="divide-y divide-brand-stoneLight">
              {[
                {
                  q: "Do you provide the truck?",
                  a: "Yes. We arrange and drive a rental truck sized for your move, so you don't have to. The truck, blankets, and equipment all come with the crew.",
                },
                {
                  q: "What's the minimum charge?",
                  a: "We have a 2-hour minimum on every job — that's it.",
                },
                {
                  q: "Are there any surprise charges?",
                  a: "No surprises. We walk you through the full estimate before we start — crew, truck, and equipment included — so the number you approve is the number you pay.",
                },
                {
                  q: "Which crew size should I book?",
                  a: "The 2-man crew works well for studios through 2BRs. We recommend 3 men for 3BR+ homes, heavy items, or tight timelines. Call us if you're unsure.",
                },
              ].map(({ q, a }) => (
                <div key={q} className="py-4">
                  <dt className="font-semibold text-brand-navy text-sm">{q}</dt>
                  <dd className="mt-1 text-sm text-brand-stone">{a}</dd>
                </div>
              ))}
            </dl>
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
            Fill out a quick quote request or give us a call — we respond fast.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center bg-brand-orange text-white font-bold py-3 px-8 rounded-xl hover:bg-brand-ember transition-colors"
            >
              Get a Free Quote
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
