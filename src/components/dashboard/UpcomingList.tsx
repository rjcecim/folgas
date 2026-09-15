"use client";

import type { CalendarEvent } from "@/types";
import { Card } from "@/components/ui/Card";
import { formatDateRange } from "@/lib/utils/dates";

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
        <ul className="space-y-1">
          {events.map((event) => (
            <li key={event.id}>
              <button
                type="button"
                onClick={() => onSelect(event)}
                className="w-full rounded-xl px-2 py-2 text-left transition hover:bg-sand"
              >
                <span className="block text-sm font-medium">{event.title}</span>
                <span className="text-xs text-mute">{formatDateRange(event.startDate, event.endDate)}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
