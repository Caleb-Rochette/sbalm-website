interface SectionHeaderProps {
  eyebrow?: string;
  heading: string;
  subheading?: string;
  centered?: boolean;
  light?: boolean;
}

export default function SectionHeader({
  eyebrow,
  heading,
  subheading,
  centered = true,
  light = false,
}: SectionHeaderProps) {
  return (
    <div className={`mb-12 ${centered ? "text-center" : ""}`}>
      {eyebrow && (
        <p className="text-sm font-semibold uppercase tracking-widest mb-3 text-brand-orange">
          {eyebrow}
        </p>
      )}
      <h2
        className={`font-heading text-3xl md:text-4xl font-bold leading-tight ${
          light ? "text-white" : "text-brand-navy"
        }`}
      >
        {heading}
      </h2>
      {subheading && (
        <p
          className={`mt-4 text-lg max-w-2xl ${centered ? "mx-auto" : ""} ${
            light ? "text-brand-mist" : "text-brand-stone"
          }`}
        >
          {subheading}
        </p>
      )}
    </div>
  );
}
