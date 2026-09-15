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
    <div className="flex flex-wrap gap-x-3 gap-y-2">
      {types.map((type) => (
        <span key={type} className="inline-flex items-center gap-1.5 text-xs text-mute">
          <span className={`h-1.5 w-1.5 rounded-full ${TYPE_STYLES[type].dot}`} />
          {TYPE_LABELS[type]}
        </span>
      ))}
    </div>
  );
}
