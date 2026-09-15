"use client";

import type { CalendarEvent } from "@/types";
import { Button } from "@/components/ui/Button";
import { STATUS_LABELS, TYPE_LABELS } from "@/lib/constants";
import { formatDateRange } from "@/lib/utils/dates";
import { TYPE_STYLES } from "@/features/calendar/eventStyles";

export function EventCatalog({
  events,
  onEdit,
  onDelete,
}: {
  events: CalendarEvent[];
  onEdit: (event: CalendarEvent) => void;
  onDelete: (event: CalendarEvent) => Promise<void>;
}) {
  if (events.length === 0) {
    return <p className="text-sm text-mute">Nenhum evento neste filtro.</p>;
  }

  return (
    <ul className="space-y-2">
      {events.map((event) => (
        <li
          key={event.id}
          className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-sand/70 px-3 py-3"
        >
          <div>
            <p className="font-medium">{event.title}</p>
            <p className="text-sm text-mute">{formatDateRange(event.startDate, event.endDate)}</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className={`rounded-full px-2 py-1 text-[11px] ${TYPE_STYLES[event.type].chip}`}>
              {TYPE_LABELS[event.type]}
            </span>
            <span className="text-xs text-mute">{STATUS_LABELS[event.status]}</span>
            <Button variant="ghost" onClick={() => onEdit(event)}>
              Editar
            </Button>
            <Button variant="danger" onClick={() => onDelete(event)}>
              Excluir
            </Button>
          </div>
        </li>
      ))}
    </ul>
  );
}
