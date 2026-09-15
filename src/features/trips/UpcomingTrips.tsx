"use client";

import type { CalendarEvent } from "@/types";
import { Card } from "@/components/ui/Card";
import { formatDateRange } from "@/lib/utils/dates";

export function UpcomingTrips({
  trips,
  onSelect,
}: {
  trips: CalendarEvent[];
  onSelect: (event: CalendarEvent) => void;
}) {
  return (
    <Card title="Viagens">
      {trips.length === 0 ? (
        <p className="text-sm text-mute">Nenhuma viagem.</p>
      ) : (
        <ul className="space-y-1">
          {trips.map((trip) => (
            <li key={trip.id}>
              <button
                type="button"
                onClick={() => onSelect(trip)}
                className="w-full rounded-xl px-2 py-2 text-left transition hover:bg-sand"
              >
                <p className="text-sm font-medium">{trip.title}</p>
                <p className="text-xs text-mute">{formatDateRange(trip.startDate, trip.endDate)}</p>
              </button>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
