import type { Metadata } from "next";
import ContactForm from "./ContactForm";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Request a quote or reach out to Sir Box a Lot Movers. Call 📞 253-523-3755 or fill out our contact form. Based in Gig Harbor, WA.",
};

export default function ContactPage() {
  return (
    <>
      {/* ── Page Hero ── */}
      <section className="bg-brand-navy text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-brand-orange text-sm font-semibold uppercase tracking-widest mb-3">
            Get in Touch
          </p>
          <h1 className="font-heading text-4xl md:text-5xl font-extrabold">
            Request a Quote
          </h1>
          <p className="mt-4 text-brand-mist text-lg max-w-xl">
            Fill out the form below or give us a call. We respond fast — usually
            within a few hours.
          </p>
        </div>
      </section>

      {/* ── Contact Section ── */}
      <section className="bg-brand-cream py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Sidebar */}
            <div className="lg:col-span-1 flex flex-col gap-8">
              <div>
                <h2 className="font-heading font-bold text-2xl text-brand-navy mb-6">
                  Reach Us Directly
                </h2>
                <div className="flex flex-col gap-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-brand-navy rounded-xl flex items-center justify-center text-xl shrink-0">
                      📞
                    </div>
                    <div>
                      <p className="font-semibold text-brand-navy text-sm">Phone</p>
                      <a
                        href="tel:2535233755"
                        className="text-brand-orange font-bold text-lg hover:underline"
                      >
                        253-523-3755
                      </a>
                      <p className="text-xs text-brand-stone mt-1">
                        Best way to reach us for same-day or urgent requests.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-brand-navy rounded-xl flex items-center justify-center text-xl shrink-0">
                      ✉️
                    </div>
                    <div>
                      <p className="font-semibold text-brand-navy text-sm">Email</p>
                      <a
                        href="mailto:daryl@sirboxalotmovers.com"
                        className="text-brand-orange font-semibold hover:underline"
                      >
                        daryl@sirboxalotmovers.com
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-brand-navy rounded-xl flex items-center justify-center text-xl shrink-0">
                      📍
                    </div>
                    <div>
                      <p className="font-semibold text-brand-navy text-sm">Address</p>
                      <address className="not-italic text-brand-stoneDark text-sm mt-1 leading-relaxed">
                        5302 58th St NW<br />
                        Gig Harbor, WA 98335
                      </address>
                    </div>
                  </div>
                </div>
              </div>

              {/* What to expect */}
              <div className="bg-brand-paper rounded-2xl p-6 border border-brand-stoneLight shadow-sm">
                <h3 className="font-heading font-bold text-brand-navy mb-4">
                  What to Expect
                </h3>
                <ul className="flex flex-col gap-3">
                  {[
                    "Response within a few hours",
                    "No-pressure quote, no obligation",
                    "2-hour minimum, 15-min increments",
                    "No fuel surcharges or hidden fees",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-brand-stoneDark">
                      <span className="text-brand-orange font-bold shrink-0">✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Form */}
            <div className="lg:col-span-2 bg-brand-paper rounded-2xl p-8 md:p-10 shadow-md border border-brand-stoneLight">
              <h2 className="font-heading font-bold text-2xl text-brand-navy mb-8">
                Tell Us About Your Move
              </h2>
              <ContactForm />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
