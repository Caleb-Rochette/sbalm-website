// CRM ONLY
type Color = "gray" | "blue" | "green" | "amber" | "red" | "teal" | "orange";

const colors: Record<Color, string> = {
  gray:   "bg-gray-100 text-gray-700",
  blue:   "bg-blue-100 text-blue-700",
  green:  "bg-green-100 text-green-700",
  amber:  "bg-amber-100 text-amber-700",
  red:    "bg-red-100 text-red-700",
  teal:   "bg-teal-100 text-teal-700",
  orange: "bg-orange-100 text-orange-700",
};

const customerColors: Record<string, Color> = {
  LEAD: "blue", BOOKED: "green", COMPLETED: "teal", CANCELLED: "red", NO_SHOW: "gray",
};
const jobColors: Record<string, Color> = {
  SCHEDULED: "blue", IN_PROGRESS: "amber", COMPLETED: "teal", CANCELLED: "red", NO_SHOW: "gray",
};
const quoteColors: Record<string, Color> = {
  SENT: "blue", ACCEPTED: "green", DECLINED: "red", EXPIRED: "gray",
};
const empColors: Record<string, Color> = { ACTIVE: "green", INACTIVE: "gray" };

export function StatusBadge({ status, type }: { status: string; type: "customer" | "job" | "quote" | "employee" }) {
  const map = type === "customer" ? customerColors : type === "job" ? jobColors : type === "quote" ? quoteColors : empColors;
  const color = map[status] ?? "gray";
  const label = status.replace(/_/g, " ");
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${colors[color]}`}>
      {label}
    </span>
  );
}
