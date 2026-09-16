"use client";

import { useMemo, useState } from "react";
import { EVENT_STATUSES, EVENT_TYPES, type CalendarEvent, type CalendarEventInput } from "@/types";
import type { AllocationPick, BankParcel } from "@/types/bank";
import { NATURE_DEFAULTS, STATUS_LABELS, TYPE_LABELS } from "@/lib/constants";
import { parcelLabel } from "@/lib/utils/bankLedger";
import { eventBankMinutes, formatDuration, hoursMinutesToMinutes, minutesToHoursMinutes } from "@/lib/utils/duration";
import { eventFormSchema } from "@/lib/validation/event";
import { Btn, Field, Input, Select, Textarea } from "./ui";

export function DayForm({
  event: currentEvent,
  dailyWorkHours,
  parcels,
  preview,
  onSubmit,
  onCancel,
}: {
  event?: CalendarEvent;
  dailyWorkHours: number;
  parcels: BankParcel[];
  preview: (minutes: number, asOf: string, eventId?: string) => { picks: AllocationPick[]; shortfall: number };
  onSubmit: (input: CalendarEventInput) => Promise<void>;
  onCancel: () => void;
}) {
  const initial = currentEvent ? minutesToHoursMinutes(Math.abs(eventBankMinutes(currentEvent))) : { hours: dailyWorkHours, minutes: 0 };
  const [title, setTitle] = useState(currentEvent?.title ?? "");
  const [startDate, setStartDate] = useState(currentEvent?.startDate ?? "");
  const [endDate, setEndDate] = useState(currentEvent?.endDate ?? currentEvent?.startDate ?? "");
  const [type, setType] = useState(currentEvent?.type ?? "bank_hours_leave");
  const [nature, setNature] = useState(currentEvent?.nature ?? NATURE_DEFAULTS.bank_hours_leave);
  const [status, setStatus] = useState(currentEvent?.status ?? "planned");
  const [hours, setHours] = useState(Math.abs(initial.hours));
  const [minutes, setMinutes] = useState(initial.minutes);
  const [includeInProjection, setIncludeInProjection] = useState(
    currentEvent?.includeInProjection ?? true,
  );
  const [legalBasis, setLegalBasis] = useState(currentEvent?.legalBasis ?? "");
  const [notes, setNotes] = useState(currentEvent?.notes ?? "");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  const usesBank = type === "bank_hours_leave" || type === "future_bank_credit";
  const totalMinutes = hoursMinutesToMinutes(hours, minutes);
  const allocation = useMemo(() => {
    if (type !== "bank_hours_leave" || !includeInProjection || !endDate) {
      return { picks: [], shortfall: totalMinutes };
    }
    return preview(totalMinutes, endDate, currentEvent?.id);
  }, [currentEvent?.id, endDate, includeInProjection, preview, totalMinutes, type]);

  return (
    <form
      className="space-y-4"
      onSubmit={async (submitEvent) => {
        submitEvent.preventDefault();
        const parsed = eventFormSchema.safeParse({
          title,
          startDate,
          endDate: endDate || startDate,
          type,
          nature,
          official: false,
          status,
          hours,
          minutes,
          includeInProjection: usesBank ? includeInProjection : false,
          legalBasis,
          notes,
        });

        if (!parsed.success) {
          const nextErrors: Record<string, string> = {};
          for (const issue of parsed.error.issues) {
            const key = String(issue.path[0] ?? "title");
            nextErrors[key] = issue.message;
          }
          setErrors(nextErrors);
          return;
        }

        const signed =
          type === "bank_hours_leave"
            ? -totalMinutes
            : type === "future_bank_credit"
              ? totalMinutes
              : 0;

        setSaving(true);
        setErrors({});
        try {
          await onSubmit({
            title: parsed.data.title,
            startDate: parsed.data.startDate,
            endDate: parsed.data.endDate,
            type: parsed.data.type,
            nature: parsed.data.nature,
            official: false,
            status: parsed.data.status,
            bankHoursImpact: signed / 60,
            bankMinutesImpact: signed,
            includeInProjection: parsed.data.includeInProjection,
            legalBasis: parsed.data.legalBasis,
            notes: parsed.data.notes,
          });
        } finally {
          setSaving(false);
        }
      }}
    >
      <Field label="Título" error={errors.title}>
        <Input value={title} onChange={(event) => setTitle(event.target.value)} />
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Início" error={errors.startDate}>
          <Input type="date" value={startDate} onChange={(event) => setStartDate(event.target.value)} />
        </Field>
        <Field label="Fim" error={errors.endDate}>
          <Input type="date" value={endDate} onChange={(event) => setEndDate(event.target.value)} />
        </Field>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Tipo">
          <Select
            value={type}
            onChange={(event) => {
              const nextType = event.target.value as CalendarEvent["type"];
              setType(nextType);
              setNature(NATURE_DEFAULTS[nextType]);
              setIncludeInProjection(
                nextType === "bank_hours_leave" || nextType === "future_bank_credit",
              );
              if (!currentEvent && (nextType === "bank_hours_leave" || nextType === "future_bank_credit")) {
                setHours(dailyWorkHours);
                setMinutes(0);
              }
            }}
          >
            {EVENT_TYPES.map((value) => (
              <option key={value} value={value}>
                {TYPE_LABELS[value]}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Status">
          <Select
            value={status}
            onChange={(event) => setStatus(event.target.value as CalendarEvent["status"])}
          >
            {EVENT_STATUSES.map((value) => (
              <option key={value} value={value}>
                {STATUS_LABELS[value]}
              </option>
            ))}
          </Select>
        </Field>
      </div>
      <Field label="Natureza" error={errors.nature}>
        <Input value={nature} onChange={(event) => setNature(event.target.value)} />
      </Field>
      {usesBank ? (
        <div className="space-y-3">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Horas" error={errors.hours}>
              <Input
                type="number"
                min={0}
                step={1}
                value={hours}
                onChange={(event) => setHours(Number(event.target.value))}
              />
            </Field>
            <Field label="Minutos" error={errors.minutes}>
              <Input
                type="number"
                min={0}
                max={59}
                step={1}
                value={minutes}
                onChange={(event) => setMinutes(Number(event.target.value))}
              />
            </Field>
          </div>
          <p className="text-sm text-soft">Duração: {formatDuration(totalMinutes)}</p>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={includeInProjection}
              onChange={(event) => setIncludeInProjection(event.target.checked)}
            />
            Incluir no controle do banco
          </label>
          {type === "bank_hours_leave" && includeInProjection ? (
            <div className="rounded-2xl bg-well px-3 py-3 text-sm ring-1 ring-hair">
              <p className="text-soft">
                {status === "planned"
                  ? "Reserva pessoal (não é consumo oficial)."
                  : "Consumo efetivado no controle pessoal."}{" "}
                A ordem abaixo prioriza o que vence primeiro — isso é só controle pessoal.
              </p>
              {allocation.picks.length === 0 ? (
                <p className="mt-2">Nenhuma parcela válida na data da folga.</p>
              ) : (
                <ul className="mt-2 space-y-1">
                  {allocation.picks.map((pick) => {
                    const parcel = parcels.find((item) => item.id === pick.parcelId);
                    return (
                      <li key={pick.parcelId}>
                        {parcel ? parcelLabel(parcel) : pick.parcelId}: {formatDuration(pick.minutes)}
                      </li>
                    );
                  })}
                </ul>
              )}
              {allocation.shortfall > 0 ? (
                <p className="mt-2 text-red-600">
                  Faltam {formatDuration(allocation.shortfall)} com validade para essa data. Saldo
                  legado sem mês de origem não entra nessa conta.
                </p>
              ) : null}
            </div>
          ) : null}
        </div>
      ) : null}
      <Field label="Referência">
        <Input value={legalBasis} onChange={(event) => setLegalBasis(event.target.value)} />
      </Field>
      <Field label="Observações">
        <Textarea value={notes} onChange={(event) => setNotes(event.target.value)} />
      </Field>
      <div className="flex flex-wrap justify-end gap-2 pt-2">
        <Btn tone="quiet" onClick={onCancel}>
          Cancelar
        </Btn>
        <Btn type="submit" disabled={saving}>
          {saving ? "Salvando..." : "Salvar"}
        </Btn>
      </div>
    </form>
  );
}
