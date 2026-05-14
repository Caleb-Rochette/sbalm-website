interface TrustPointProps {
  headline: string;
  body: string;
  icon: string;
  light?: boolean;
}

export default function TrustPoint({ headline, body, icon, light = false }: TrustPointProps) {
  return (
    <div className="flex gap-4 items-start">
      <div
        className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${
          light ? "bg-white/10" : "bg-brand-navy/10"
        }`}
      >
        {icon}
      </div>
      <div>
        <h3 className={`font-heading font-bold text-lg ${light ? "text-white" : "text-brand-navy"}`}>
          {headline}
        </h3>
        <p className={`mt-1 text-sm leading-relaxed ${light ? "text-brand-mist" : "text-brand-stone"}`}>
          {body}
        </p>
      </div>
    </div>
  );
}
