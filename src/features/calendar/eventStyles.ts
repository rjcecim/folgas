import type { CalendarEvent, EventType } from "@/types";

export const TYPE_STYLES: Record<
  EventType,
  { dot: string; chip: string; label: string }
> = {
  national_holiday: {
    dot: "bg-rose-700",
    chip: "bg-rose-100 text-rose-800",
    label: "Feriado Nacional",
  },
  municipal_holiday: {
    dot: "bg-orange-600",
    chip: "bg-orange-100 text-orange-800",
    label: "Feriado Municipal",
  },
  optional_day: {
    dot: "bg-amber-500",
    chip: "bg-amber-100 text-amber-900",
    label: "Ponto Facultativo",
  },
  work_suspension: {
    dot: "bg-violet-700",
    chip: "bg-violet-100 text-violet-800",
    label: "Suspensão",
  },
  recess: {
    dot: "bg-slate-700",
    chip: "bg-slate-200 text-slate-800",
    label: "Recesso",
  },
  bank_hours_leave: {
    dot: "bg-emerald-700",
    chip: "bg-emerald-100 text-emerald-800",
    label: "Banco de Horas",
  },
  future_bank_credit: {
    dot: "bg-teal-700",
    chip: "bg-teal-100 text-teal-800",
    label: "Crédito Futuro",
  },
  trip: {
    dot: "bg-sky-700",
    chip: "bg-sky-100 text-sky-800",
    label: "Viagem",
  },
  other: {
    dot: "bg-stone-500",
    chip: "bg-stone-200 text-stone-800",
    label: "Outro",
  },
};

export function eventTone(event: CalendarEvent) {
  return event.status === "planned"
    ? "border-dashed border-ink/30 bg-white/70"
    : "border-transparent";
}
