"use client";

import type { CalendarEvent } from "@/types";
import { Button } from "@/components/ui/Button";
import { STATUS_LABELS, TYPE_LABELS } from "@/lib/constants";
import { formatDateRange } from "@/lib/utils/dates";
import { formatHours } from "@/lib/utils/projection";
import { TYPE_STYLES } from "@/features/calendar/eventStyles";

export function EventDetails({
  event,
  onEdit,
  onDelete,
}: {
  event: CalendarEvent;
  onEdit: () => void;
  onDelete: () => Promise<void>;
}) {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <span className={`rounded-full px-3 py-1 text-xs font-medium ${TYPE_STYLES[event.type].chip}`}>
          {TYPE_LABELS[event.type]}
        </span>
        <span
          className={`rounded-full px-3 py-1 text-xs font-medium ${
            event.official ? "bg-ink text-cream" : "border border-dashed border-ink/40 text-ink"
          }`}
        >
          {event.official ? "Oficial" : "Planejado"}
        </span>
        <span className="rounded-full bg-sand px-3 py-1 text-xs text-ink">
          {STATUS_LABELS[event.status]}
        </span>
      </div>
      <dl className="space-y-3 text-sm">
        <div>
          <dt className="text-xs uppercase tracking-[0.16em] text-mute">Período</dt>
          <dd className="mt-1 text-ink">{formatDateRange(event.startDate, event.endDate)}</dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-[0.16em] text-mute">Natureza</dt>
          <dd className="mt-1 text-ink">{event.nature}</dd>
        </div>
        {event.legalBasis ? (
          <div>
            <dt className="text-xs uppercase tracking-[0.16em] text-mute">Fundamento</dt>
            <dd className="mt-1 text-ink">{event.legalBasis}</dd>
          </div>
        ) : null}
        {event.bankHoursImpact !== 0 ? (
          <div>
            <dt className="text-xs uppercase tracking-[0.16em] text-mute">Impacto no banco</dt>
            <dd className="mt-1 text-ink">{formatHours(event.bankHoursImpact)}</dd>
          </div>
        ) : null}
        {event.notes ? (
          <div>
            <dt className="text-xs uppercase tracking-[0.16em] text-mute">Observações</dt>
            <dd className="mt-1 whitespace-pre-wrap text-ink">{event.notes}</dd>
          </div>
        ) : null}
      </dl>
      <div className="flex flex-wrap justify-end gap-2">
        <Button variant="danger" onClick={onDelete}>
          Excluir
        </Button>
        <Button onClick={onEdit}>Editar</Button>
      </div>
    </div>
  );
}
