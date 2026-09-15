"use client";

import { useMemo, useState } from "react";
import { EVENT_STATUSES, EVENT_TYPES, type CalendarEvent, type CalendarEventInput } from "@/types";
import { NATURE_DEFAULTS, STATUS_LABELS, TYPE_LABELS } from "@/lib/constants";
import { eventFormSchema } from "@/lib/validation/event";
import { Btn, Field, Input, Select, Textarea } from "./ui";

export function DayForm({
  event: currentEvent,
  dailyWorkHours,
  onSubmit,
  onCancel,
}: {
  event?: CalendarEvent;
  dailyWorkHours: number;
  onSubmit: (input: CalendarEventInput) => Promise<void>;
  onCancel: () => void;
}) {
  const [title, setTitle] = useState(currentEvent?.title ?? "");
  const [startDate, setStartDate] = useState(currentEvent?.startDate ?? "");
  const [endDate, setEndDate] = useState(currentEvent?.endDate ?? currentEvent?.startDate ?? "");
  const [type, setType] = useState(currentEvent?.type ?? "bank_hours_leave");
  const [nature, setNature] = useState(currentEvent?.nature ?? NATURE_DEFAULTS.bank_hours_leave);
  const [status, setStatus] = useState(currentEvent?.status ?? "planned");
  const [hours, setHours] = useState(
    currentEvent ? Math.abs(currentEvent.bankHoursImpact) : dailyWorkHours,
  );
  const [includeInProjection, setIncludeInProjection] = useState(
    currentEvent?.includeInProjection ?? true,
  );
  const [legalBasis, setLegalBasis] = useState(currentEvent?.legalBasis ?? "");
  const [notes, setNotes] = useState(currentEvent?.notes ?? "");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  const usesBank = type === "bank_hours_leave" || type === "future_bank_credit";

  const computedImpact = useMemo(() => {
    if (type === "bank_hours_leave") return -Math.abs(hours);
    if (type === "future_bank_credit") return Math.abs(hours);
    return 0;
  }, [hours, type]);

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
            bankHoursImpact: computedImpact,
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
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Horas do banco" error={errors.hours}>
            <Input
              type="number"
              min={0}
              step="0.5"
              value={hours}
              onChange={(event) => setHours(Number(event.target.value))}
            />
          </Field>
          <label className="flex items-end gap-2 pb-2 text-sm">
            <input
              type="checkbox"
              checked={includeInProjection}
              onChange={(event) => setIncludeInProjection(event.target.checked)}
            />
            Incluir na projeção
          </label>
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
