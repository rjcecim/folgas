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
    <Card title="Próximas viagens">
      {trips.length === 0 ? (
        <p className="text-sm text-mute">Nenhuma viagem cadastrada à frente.</p>
      ) : (
        <ul className="space-y-2">
          {trips.map((trip) => (
            <li key={trip.id}>
              <button
                type="button"
                onClick={() => onSelect(trip)}
                className="w-full rounded-2xl bg-sky-50 px-3 py-2 text-left hover:bg-sky-100"
              >
                <p className="font-medium text-ink">{trip.title}</p>
                <p className="text-sm text-mute">{formatDateRange(trip.startDate, trip.endDate)}</p>
              </button>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
