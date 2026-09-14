"use client";

import type { CalendarEvent } from "@/types";
import { todayISO } from "@/lib/utils/dates";
import { TYPE_STYLES, eventTone } from "./eventStyles";

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
    return <div className="min-h-24 rounded-2xl bg-transparent" />;
  }

  const dayNumber = Number(date.slice(-2));
  const isToday = date === todayISO();

  return (
    <div
      className={`min-h-24 rounded-2xl border border-line bg-white/80 p-2 ${
        isToday ? "ring-2 ring-terra" : ""
      }`}
    >
      <div className="mb-1 flex items-center justify-between">
        <span className={`text-sm ${isToday ? "font-semibold text-terra" : "text-ink"}`}>
          {dayNumber}
        </span>
      </div>
      <div className="space-y-1">
        {events.slice(0, 3).map((event) => (
          <button
            key={event.id}
            type="button"
            onClick={() => onSelect(event)}
            className={`block w-full truncate rounded-lg border px-1.5 py-1 text-left text-[11px] leading-4 ${TYPE_STYLES[event.type].chip} ${eventTone(event)}`}
          >
            {event.title}
          </button>
        ))}
        {events.length > 3 ? (
          <p className="text-[10px] text-mute">+{events.length - 3} mais</p>
        ) : null}
      </div>
    </div>
  );
}
