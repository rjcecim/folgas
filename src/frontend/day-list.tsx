"use client";

import type { CalendarEvent } from "@/types";
import { STATUS_LABELS, TYPE_LABELS } from "@/lib/constants";
import { formatDateRange } from "@/lib/utils/dates";
import { TYPE_COLOR } from "./colors";
import { Btn } from "./ui";

export function DayList({
  events,
  onEdit,
  onDelete,
}: {
  events: CalendarEvent[];
  onEdit: (event: CalendarEvent) => void;
  onDelete: (event: CalendarEvent) => Promise<void>;
}) {
  if (events.length === 0) {
    return <p className="text-sm text-soft">Nada neste filtro.</p>;
  }

  return (
    <ul className="space-y-2">
      {events.map((event) => (
        <li key={event.id} className="rounded-3xl bg-page px-4 py-3">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="font-medium">{event.title}</p>
              <p className="mt-1 text-sm text-soft">{formatDateRange(event.startDate, event.endDate)}</p>
              <p className="mt-2 flex items-center gap-2 text-xs text-soft">
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ background: TYPE_COLOR[event.type] }}
                />
                {TYPE_LABELS[event.type]} · {STATUS_LABELS[event.status]}
              </p>
            </div>
            <div className="flex gap-2">
              <Btn tone="ghost" onClick={() => onEdit(event)}>
                Editar
              </Btn>
              <Btn tone="danger" onClick={() => onDelete(event)}>
                Excluir
              </Btn>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
