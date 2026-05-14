import type { Metadata } from "next";
import Link from "next/link";
import PricingCard from "@/components/PricingCard";
import ReviewCard from "@/components/ReviewCard";
import TrustPoint from "@/components/TrustPoint";
import SectionHeader from "@/components/SectionHeader";

export const metadata: Metadata = {
  title: "Sir Box a Lot Movers | Labor-Only Moving in Gig Harbor, WA",
  description:
    "Labor-only movers serving Pierce, King, and Kitsap counties. Strong backs, careful hands — we hustle. 2-man crew from $125/hr.",
};

const trustPoints = [
  {
    icon: "🛡️",
    headline: "We treat your belongings like they are our own.",
    body: "Furniture padded, corners cleared, floors protected.",
  },
  {
    icon: "🤝",
    headline: "Friendly, courteous crews — from first lift to last box.",
    body: "No attitude, no drama.",
  },
  {
    icon: "💪",
    headline: "We hustle between loads — strong backs and careful hands.",
    body: "No leaning on the truck on your dime.",
  },
  {
    icon: "💵",
    headline: "Fair, transparent billing — no surprises.",
    body: "2-hour minimum, 15-min increments, no hidden fees.",
  },
];

const reviews = [
  {
    name: "Jamie M.",
    location: "Tacoma, WA",
    review:
      "These guys are the real deal. Showed up five minutes early, worked like they were on a mission, and not a single scratch on anything. Finished our 2-bedroom in under three hours. Will 100% call them again.",
  },
  {
    name: "Samantha R.",
    location: "Puyallup, WA",
    review:
      "Super respectful of my furniture, communicated the whole time, and honestly seemed to enjoy the work. No standing around, no excuses — just got it done.",
  },
  {
    name: "Derek L.",
    location: "Federal Way, WA",
    review:
      "Price was unbelievable for the quality. Friendly, fast, and careful. Highly recommend Sir Box a Lot to anyone in the South Sound area.",
  },
];

export default function HomePage() {
  return (
    <>
      {/* ── Hero ── */}
      <section className="bg-brand-navy text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-5 bg-[radial-gradient(circle_at_20%_50%,white_1px,transparent_1px)] bg-[length:32px_32px]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="max-w-3xl">
            <p className="text-brand-orange font-semibold text-sm uppercase tracking-widest mb-4">
              Gig Harbor, WA · Pierce · King · Kitsap Counties
            </p>
            <h1 className="font-heading text-5xl md:text-6xl font-extrabold leading-tight">
              Moving Day Made{" "}
              <span className="text-brand-orange">Easy.</span>
            </h1>
            <p className="mt-6 text-xl text-brand-mist leading-relaxed max-w-2xl">
              Strong backs. Careful hands. We hustle. You rent the truck — we
              handle every lift, carry, and corner from start to finish.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center bg-brand-orange text-white font-bold py-4 px-8 rounded-xl hover:bg-brand-ember transition-colors text-base"
              >
                Get a Free Quote
              </Link>
              <a
                href="tel:2535233755"
                className="inline-flex items-center justify-center gap-2 border-2 border-white/30 text-white font-semibold py-4 px-8 rounded-xl hover:border-white hover:bg-white/10 transition-colors text-base"
              >
                📞 253-523-3755
              </a>
            </div>
            <p className="mt-6 text-sm text-brand-mist">
              2-hour minimum · No fuel surcharges · Labor only
            </p>
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="bg-brand-cream py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="Simple Process"
            heading="How It Works"
            subheading="Three steps stand between you and a stress-free move."
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
            {[
              {
                step: "01",
                title: "You Rent the Truck",
                body: "Book a U-Haul, Penske, Budget, or any rental truck that fits your move. We help you pick the right size if you need advice.",
              },
              {
                step: "02",
                title: "We Show Up Ready",
                body: "Your crew arrives on time, padded and ready. We load with care, protect your home and belongings, and hustle every minute.",
              },
              {
                step: "03",
                title: "Pay Only for Time Worked",
                body: "Two-hour minimum, then billed in 15-minute increments. No fuel surcharges. No hidden fees. Just honest labor.",
              },
            ].map(({ step, title, body }) => (
              <div key={step} className="relative bg-brand-paper rounded-2xl p-8 shadow-sm border border-brand-stoneLight">
                <span className="absolute -top-4 left-8 bg-brand-orange text-white font-extrabold text-sm px-3 py-1 rounded-full">
                  Step {step}
                </span>
                <h3 className="font-heading font-bold text-xl text-brand-navy mt-2 mb-3">{title}</h3>
                <p className="text-brand-stone text-sm leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing ── */}
      <section className="bg-brand-paper py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="Pricing"
            heading="Straightforward Rates"
            subheading="No hidden fees. No fuel surcharges. Just honest labor."
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            <PricingCard
              crew="2-Man Crew"
              rate="$125"
              features={[
                "2 professional movers",
                "2-hour minimum",
                "15-min billing increments after",
                "Loading and/or unloading",
                "No fuel surcharges",
              ]}
            />
            <PricingCard
              crew="3-Man Crew"
              rate="$175"
              highlight
              features={[
                "3 professional movers",
                "2-hour minimum",
                "15-min billing increments after",
                "Loading and/or unloading",
                "Faster for larger homes",
              ]}
            />
          </div>
          <p className="text-center text-brand-stone text-sm mt-8">
            Not sure which crew size you need?{" "}
            <a href="tel:2535233755" className="text-brand-orange font-semibold hover:underline">
              Give us a call — we&apos;re happy to help.
            </a>
          </p>
        </div>
      </section>

      {/* ── Trust Points ── */}
      <section className="bg-brand-navy py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="Our Promise"
            heading="What We Stand For"
            subheading="This is what you get every time, with every crew."
            light
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {trustPoints.map((tp) => (
              <TrustPoint key={tp.headline} {...tp} light />
            ))}
          </div>
        </div>
      </section>

      {/* ── Reviews ── */}
      <section className="bg-brand-cream py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="Reviews"
            heading="What Our Customers Say"
            subheading="Don't just take our word for it."
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {reviews.map((r) => (
              <ReviewCard key={r.name} {...r} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="bg-brand-orange py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-heading text-4xl md:text-5xl font-extrabold text-white">
            Let&apos;s make your move happen.
          </h2>
          <p className="mt-4 text-orange-100 text-lg">
            Call us today or fill out a quick quote request — we&apos;ll get back to you fast.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center bg-brand-navy text-white font-bold py-4 px-8 rounded-xl hover:bg-brand-navyLight transition-colors text-base"
            >
              Request a Quote
            </Link>
            <a
              href="tel:2535233755"
              className="inline-flex items-center justify-center gap-2 border-2 border-white text-white font-bold py-4 px-8 rounded-xl hover:bg-white hover:text-brand-orange transition-colors text-base"
            >
              📞 253-523-3755
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
