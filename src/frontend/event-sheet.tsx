"use client";

import Link from "next/link";
import type { CalendarEvent } from "@/types";
import { STATUS_LABELS, TYPE_LABELS } from "@/lib/constants";
import { formatDateRange } from "@/lib/utils/dates";
import { formatHours } from "@/lib/utils/projection";
import { TYPE_COLOR } from "./colors";
import { Btn, Sheet } from "./ui";

export function EventSheet({
  event,
  onClose,
  onDelete,
}: {
  event: CalendarEvent;
  onClose: () => void;
  onDelete: (event: CalendarEvent) => Promise<void>;
}) {
  return (
    <Sheet title={event.title} onClose={onClose}>
      <div className="space-y-5">
        <div className="flex flex-wrap items-center gap-2">
          <span
            className="inline-flex items-center gap-2 rounded-full bg-well px-3 py-1 text-sm"
          >
            <span
              className="h-2 w-2 rounded-full"
              style={{ background: TYPE_COLOR[event.type] }}
            />
            {TYPE_LABELS[event.type]}
          </span>
          <span className="text-sm text-soft">{STATUS_LABELS[event.status]}</span>
        </div>
        <p className="text-lg">{formatDateRange(event.startDate, event.endDate)}</p>
        <p className="text-soft">{event.nature}</p>
        {event.legalBasis ? <p className="text-sm text-soft">{event.legalBasis}</p> : null}
        {event.bankHoursImpact !== 0 ? (
          <p className="text-sm">Banco: {formatHours(event.bankHoursImpact)}</p>
        ) : null}
        {event.notes ? <p className="whitespace-pre-wrap text-sm">{event.notes}</p> : null}
        <div className="flex flex-wrap justify-end gap-2 pt-2">
          <Btn
            tone="danger"
            onClick={async () => {
              await onDelete(event);
              onClose();
            }}
          >
            Excluir
          </Btn>
          <Link href={`/cadastro/?edit=${event.id}`}>
            <Btn>Editar</Btn>
          </Link>
        </div>
      </div>
    </Sheet>
  );
}
