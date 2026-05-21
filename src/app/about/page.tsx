import type { Metadata } from "next";
import Link from "next/link";
import TrustPoint from "@/components/TrustPoint";
import SectionHeader from "@/components/SectionHeader";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Meet the team behind Sir Box a Lot Movers. Labor-only movers based in Gig Harbor, WA — built on hustle, honesty, and careful hands.",
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
    body: "2-hour minimum, 15-min increments.",
  },
];

export default function AboutPage() {
  return (
    <>
      {/* ── Hero ── */}
      <section className="bg-brand-navy text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-brand-orange text-sm font-semibold uppercase tracking-widest mb-3">
            Who We Are
          </p>
          <h1 className="font-heading text-4xl md:text-5xl font-extrabold">
            About Sir Box a Lot Movers
          </h1>
          <p className="mt-4 text-brand-mist text-xl font-medium italic">
            &ldquo;Strong backs. Careful hands. We hustle.&rdquo;
          </p>
          <p className="mt-4 text-brand-mist text-lg max-w-2xl">
            A labor-only moving company rooted in Gig Harbor, WA — built on the
            belief that moving day shouldn&apos;t be a nightmare.
          </p>
        </div>
      </section>

      {/* ── Our Story ── */}
      {/*
        TODO (Daryl): Replace this entire section with your real story.
        Suggested points to cover:
        - Why you started Sir Box a Lot (personal experience? saw a gap in the market?)
        - How long you've been operating
        - What the "labor-only" model means to you and why you chose it
        - Your connection to the Gig Harbor / South Sound community
        - Any personal touches (background, what drives the crew)
      */}
      <section className="bg-brand-paper py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <SectionHeader
                eyebrow="Our Story"
                heading="Born in Gig Harbor. Built to Hustle."
                centered={false}
              />
              {/* TODO: Replace placeholder paragraphs below with owner's real story */}
              <div className="space-y-4 text-brand-stoneDark leading-relaxed">
                <p>
                  [Owner story — add your personal narrative here. Tell customers
                  why you started Sir Box a Lot, what drives your crew, and what
                  makes you different from the big national chains.]
                </p>
                <p>
                  We are proud to serve the communities of Pierce, King, and
                  Kitsap counties — people who work hard, care about their
                  homes, and deserve a moving crew that does the same.
                </p>
                <p>
                  Every move is treated like it&apos;s our own. No shortcuts, no
                  attitude, no surprises on the bill.
                </p>
              </div>
            </div>

            {/* Team photo placeholder */}
            {/*
              TODO: Replace this placeholder with a real team photo.
              Recommended: crew in front of the truck, smiling and ready.
              Add to /public/team-photo.jpg and use an <Image> component.
            */}
            <div className="bg-brand-cream rounded-2xl aspect-[4/3] flex flex-col items-center justify-center border-2 border-dashed border-brand-stoneLight text-center px-8 gap-3">
              <div className="text-5xl">📸</div>
              <p className="font-semibold text-brand-navy">Team Photo</p>
              <p className="text-sm text-brand-stone">
                TODO: Add a crew photo here
                <br />
                <code className="bg-brand-fog px-1 rounded text-xs">/public/team-photo.jpg</code>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Values ── */}
      <section className="bg-brand-navy py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="Our Promise"
            heading="What We Stand For"
            subheading="Four commitments we keep on every single job."
            light
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {trustPoints.map((tp) => (
              <TrustPoint key={tp.headline} {...tp} light />
            ))}
          </div>
        </div>
      </section>

      {/* ── Service Area snapshot ── */}
      <section className="bg-brand-cream py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <SectionHeader
            eyebrow="Where We Work"
            heading="Serving the Puget Sound"
            subheading="Based in Gig Harbor — reaching Pierce, King, and Kitsap counties."
          />
          <div className="flex flex-wrap justify-center gap-3">
            {[
              "Pierce County", "King County", "Kitsap County",
              "Tacoma", "Puyallup", "Federal Way",
              "Gig Harbor", "Bremerton", "Auburn", "Kent",
            ].map((city) => (
              <span
                key={city}
                className="bg-brand-paper text-brand-navy text-sm font-medium px-4 py-2 rounded-full border border-brand-stoneLight shadow-sm"
              >
                {city}
              </span>
            ))}
          </div>
          <Link
            href="/service-area"
            className="mt-8 inline-flex items-center gap-2 text-brand-orange font-semibold hover:underline"
          >
            See full service area →
          </Link>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="bg-brand-orange py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-white">
            Ready to work with us?
          </h2>
          <p className="mt-4 text-orange-100">
            Get a free quote or give us a call — we&apos;re easy to reach.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center bg-brand-navy text-white font-bold py-3 px-8 rounded-xl hover:bg-brand-navyLight transition-colors"
            >
              Get a Free Quote
            </Link>
            <a
              href="tel:2535233755"
              className="inline-flex items-center justify-center gap-2 border-2 border-white text-white font-bold py-3 px-8 rounded-xl hover:bg-white hover:text-brand-orange transition-colors"
            >
              📞 253-523-3755
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
