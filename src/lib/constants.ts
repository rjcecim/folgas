import type { EventStatus, EventType } from "@/types";

export const AUTHORIZED_EMAIL =
  process.env.NEXT_PUBLIC_AUTHORIZED_EMAIL || "rjcecim@gmail.com";

export const FIREBASE_PROJECT_ID =
  process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "folgas-rjcecim";

export const DEFAULT_DAILY_WORK_HOURS = 8;
export const DEFAULT_BANK_BALANCE_HOURS = 0;
export const DEFAULT_CALENDAR_YEAR = 2026;

export const TYPE_LABELS: Record<EventType, string> = {
  national_holiday: "Feriado Nacional",
  municipal_holiday: "Feriado Municipal",
  optional_day: "Ponto Facultativo",
  work_suspension: "Suspensão do Expediente",
  recess: "Recesso",
  bank_hours_leave: "Banco de Horas",
  future_bank_credit: "Crédito Futuro",
  trip: "Viagem",
  other: "Outro",
};

export const NATURE_DEFAULTS: Record<EventType, string> = {
  national_holiday: "Feriado Nacional",
  municipal_holiday: "Feriado Municipal",
  optional_day: "Ponto Facultativo",
  work_suspension: "Suspensão do expediente",
  recess: "Recesso",
  bank_hours_leave: "Folga com banco de horas",
  future_bank_credit: "Crédito futuro de banco de horas",
  trip: "Viagem",
  other: "Outro",
};

export const STATUS_LABELS: Record<EventStatus, string> = {
  official: "Cadastrado",
  planned: "Planejado",
  confirmed: "Confirmado",
};

export function calendarYears(extraYears: number[] = []) {
  const current = new Date().getFullYear();
  const years = new Set<number>(extraYears);
  for (let year = current - 1; year <= current + 6; year += 1) {
    years.add(year);
  }
  return [...years].sort((a, b) => a - b);
}

export const WEEKDAY_LABELS = ["Sáb", "Dom", "Seg", "Ter", "Qua", "Qui", "Sex"];

export const MONTH_LABELS = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];
