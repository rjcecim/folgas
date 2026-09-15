"use client";

import type { CalendarEvent } from "@/types";
import { isWeekend, todayISO } from "@/lib/utils/dates";
import { TYPE_STYLES } from "./eventStyles";

export function CalendarDay({
  date,
  events,
  onSelect,
}: {
  date: string | null;
  events: CalendarEvent[];
  onSelect: (event: CalendarEvent) => void;
}) {
  if (!date) {
    return <div className="min-h-[6.5rem] rounded-2xl bg-sand/30" />;
  }

  const dayNumber = Number(date.slice(-2));
  const isToday = date === todayISO();
  const weekend = isWeekend(date);

  return (
    <div
      className={`min-h-[6.5rem] rounded-2xl border p-2 transition ${
        isToday
          ? "border-terra/50 bg-terra/8"
          : weekend
            ? "border-transparent bg-sand/40"
            : "border-transparent bg-sand/70 hover:border-line"
      }`}
    >
      <div className="mb-2">
        <span
          className={`inline-flex h-7 w-7 items-center justify-center rounded-full text-sm ${
            isToday ? "bg-terra font-semibold text-black" : "text-ink/90"
          }`}
        >
          {dayNumber}
        </span>
      </div>
      <div className="space-y-1">
        {events.slice(0, 3).map((event) => (
          <button
            key={event.id}
            type="button"
            onClick={() => onSelect(event)}
            className="flex w-full items-center gap-1.5 rounded-lg px-1 py-0.5 text-left hover:bg-white/5"
          >
            <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${TYPE_STYLES[event.type].dot}`} />
            <span className="truncate text-[11px] leading-4 text-ink/90">{event.title}</span>
          </button>
        ))}
        {events.length > 3 ? (
          <p className="px-1 text-[10px] text-mute">+{events.length - 3}</p>
        ) : null}
      </div>
    </div>
  );
}
