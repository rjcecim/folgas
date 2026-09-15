"use client";

import Link from "next/link";
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
  onEdit?: () => void;
  onDelete: () => Promise<void>;
}) {
  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-2">
        <span className={`rounded-full px-3 py-1 text-xs font-medium ${TYPE_STYLES[event.type].chip}`}>
          {TYPE_LABELS[event.type]}
        </span>
        <span
          className={`rounded-full px-3 py-1 text-xs font-medium ${
            event.status === "planned" ? "border border-dashed border-line text-mute" : "bg-sand text-ink"
          }`}
        >
          {STATUS_LABELS[event.status]}
        </span>
      </div>
      <dl className="space-y-4 text-sm">
        <div>
          <dt className="text-xs text-mute">Período</dt>
          <dd className="mt-1">{formatDateRange(event.startDate, event.endDate)}</dd>
        </div>
        <div>
          <dt className="text-xs text-mute">Natureza</dt>
          <dd className="mt-1">{event.nature}</dd>
        </div>
        {event.legalBasis ? (
          <div>
            <dt className="text-xs text-mute">Referência</dt>
            <dd className="mt-1">{event.legalBasis}</dd>
          </div>
        ) : null}
        {event.bankHoursImpact !== 0 ? (
          <div>
            <dt className="text-xs text-mute">Impacto no banco</dt>
            <dd className="mt-1 font-mono">{formatHours(event.bankHoursImpact)}</dd>
          </div>
        ) : null}
        {event.notes ? (
          <div>
            <dt className="text-xs text-mute">Observações</dt>
            <dd className="mt-1 whitespace-pre-wrap">{event.notes}</dd>
          </div>
        ) : null}
      </dl>
      <div className="flex flex-wrap justify-end gap-2">
        <Button variant="danger" onClick={onDelete}>
          Excluir
        </Button>
        {onEdit ? <Button onClick={onEdit}>Editar</Button> : null}
        <Link href={`/cadastro/?edit=${event.id}`}>
          <Button>Editar</Button>
        </Link>
      </div>
    </div>
  );
}
