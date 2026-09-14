import { TYPE_LABELS } from "@/lib/constants";
import { TYPE_STYLES } from "@/features/calendar/eventStyles";
import type { EventType } from "@/types";

const types: EventType[] = [
  "national_holiday",
  "municipal_holiday",
  "optional_day",
  "work_suspension",
  "recess",
  "bank_hours_leave",
  "future_bank_credit",
  "trip",
  "other",
];

export function Legend() {
  return (
    <div className="flex flex-wrap gap-2">
      {types.map((type) => (
        <span
          key={type}
          className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs ${TYPE_STYLES[type].chip}`}
        >
          <span className={`h-2 w-2 rounded-full ${TYPE_STYLES[type].dot}`} />
          {TYPE_LABELS[type]}
        </span>
      ))}
      <span className="inline-flex items-center rounded-full bg-ink px-3 py-1 text-xs text-cream">
        Oficial
      </span>
      <span className="inline-flex items-center rounded-full border border-dashed border-ink/40 px-3 py-1 text-xs text-ink">
        Planejado
      </span>
    </div>
  );
}
