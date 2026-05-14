interface PricingCardProps {
  crew: string;
  rate: string;
  highlight?: boolean;
  features: string[];
}

export default function PricingCard({ crew, rate, highlight = false, features }: PricingCardProps) {
  return (
    <div
      className={`relative rounded-2xl p-8 flex flex-col gap-6 shadow-lg transition-transform hover:-translate-y-1 ${
        highlight
          ? "bg-brand-navy text-white border-2 border-brand-orange"
          : "bg-brand-paper text-brand-dark border border-brand-stoneLight"
      }`}
    >
      {highlight && (
        <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-brand-orange text-white text-xs font-bold uppercase tracking-widest px-4 py-1 rounded-full">
          Most Popular
        </span>
      )}
      <div>
        <h3 className={`font-heading text-2xl font-bold ${highlight ? "text-white" : "text-brand-navy"}`}>
          {crew}
        </h3>
        <div className="mt-2 flex items-baseline gap-1">
          <span className="text-4xl font-extrabold">{rate}</span>
          <span className={`text-sm ${highlight ? "text-brand-mist" : "text-brand-stone"}`}>/hr</span>
        </div>
      </div>
      <ul className="flex flex-col gap-3">
        {features.map((f) => (
          <li key={f} className="flex items-start gap-2">
            <span className="text-brand-orange font-bold mt-0.5 shrink-0">✓</span>
            <span className={`text-sm ${highlight ? "text-brand-mist" : "text-brand-stone"}`}>{f}</span>
          </li>
        ))}
      </ul>
      <a
        href="/contact"
        className={`mt-auto inline-block text-center py-3 px-6 rounded-xl font-semibold text-sm transition-colors ${
          highlight
            ? "bg-brand-orange text-white hover:bg-brand-ember"
            : "bg-brand-navy text-white hover:bg-brand-navyLight"
        }`}
      >
        Get a Quote
      </a>
    </div>
  );
}
