interface ReviewCardProps {
  name: string;
  location: string;
  review: string;
  stars?: number;
}

export default function ReviewCard({ name, location, review, stars = 5 }: ReviewCardProps) {
  return (
    <div className="bg-brand-paper rounded-2xl p-8 shadow-md border border-brand-stoneLight flex flex-col gap-4">
      <div className="flex gap-0.5 text-brand-orange text-xl" aria-label={`${stars} out of 5 stars`}>
        {"★".repeat(stars)}
      </div>
      <blockquote className="text-brand-stoneDark leading-relaxed italic">
        &ldquo;{review}&rdquo;
      </blockquote>
      <div className="mt-auto">
        <p className="font-semibold text-brand-navy">{name}</p>
        <p className="text-sm text-brand-stone">{location}</p>
      </div>
    </div>
  );
}
