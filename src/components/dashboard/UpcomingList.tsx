"use client";

import type { CalendarEvent } from "@/types";
import { Card } from "@/components/ui/Card";
import { TYPE_LABELS } from "@/lib/constants";
import { formatDateRange } from "@/lib/utils/dates";
import { TYPE_STYLES } from "@/features/calendar/eventStyles";

export function UpcomingList({
  title,
  events,
  empty,
  onSelect,
}: {
  title: string;
  events: CalendarEvent[];
  empty: string;
  onSelect: (event: CalendarEvent) => void;
}) {
  return (
    <Card title={title}>
      {events.length === 0 ? (
        <p className="text-sm text-mute">{empty}</p>
      ) : (
        <ul className="space-y-2">
          {events.map((event) => (
            <li key={event.id}>
              <button
                type="button"
                onClick={() => onSelect(event)}
                className="flex w-full items-start justify-between gap-3 rounded-2xl bg-sand px-3 py-2 text-left hover:bg-sand/70"
              >
                <span>
                  <span className="block font-medium text-ink">{event.title}</span>
                  <span className="text-sm text-mute">
                    {formatDateRange(event.startDate, event.endDate)}
                  </span>
                </span>
                <span className={`rounded-full px-2 py-1 text-[11px] ${TYPE_STYLES[event.type].chip}`}>
                  {TYPE_LABELS[event.type]}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
