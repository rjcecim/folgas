import type { CalendarEvent, EventType } from "@/types";

export const TYPE_STYLES: Record<
  EventType,
  { dot: string; chip: string; label: string }
> = {
  national_holiday: { dot: "bg-red-400", chip: "bg-red-400/15 text-red-200", label: "Feriado Nacional" },
  municipal_holiday: { dot: "bg-orange-400", chip: "bg-orange-400/15 text-orange-200", label: "Feriado Municipal" },
  optional_day: { dot: "bg-amber-300", chip: "bg-amber-300/15 text-amber-100", label: "Ponto Facultativo" },
  work_suspension: { dot: "bg-violet-400", chip: "bg-violet-400/15 text-violet-200", label: "Suspensão" },
  recess: { dot: "bg-zinc-400", chip: "bg-zinc-400/15 text-zinc-200", label: "Recesso" },
  bank_hours_leave: { dot: "bg-terra", chip: "bg-terra/15 text-lime-100", label: "Banco de Horas" },
  future_bank_credit: { dot: "bg-teal-400", chip: "bg-teal-400/15 text-teal-100", label: "Crédito Futuro" },
  trip: { dot: "bg-sky-400", chip: "bg-sky-400/15 text-sky-100", label: "Viagem" },
  other: { dot: "bg-zinc-500", chip: "bg-zinc-500/15 text-zinc-300", label: "Outro" },
};

export function eventTone(event: CalendarEvent) {
  return event.status === "planned" ? "opacity-70" : "";
}
