import type { CalendarEvent } from "@/types";
import type { BankSummary } from "@/types/bank";
import { eventBankMinutes } from "./duration";

export interface BankHoursProjection extends BankSummary {
  futureCreditMinutes: number;
  projectedMinutes: number;
  minutesStillNeeded: number;
  tone: "positive" | "zero" | "negative";
}

export function projectBankHours(
  summary: BankSummary,
  events: CalendarEvent[],
): BankHoursProjection {
  const futureCreditMinutes = events
    .filter((event) => event.includeInProjection && event.type === "future_bank_credit")
    .reduce((sum, event) => sum + Math.abs(eventBankMinutes(event)), 0);
  const projectedMinutes = summary.confirmedMinutes + futureCreditMinutes;
  const uncoveredLeave = events
    .filter(
      (event) =>
        event.includeInProjection &&
        event.type === "bank_hours_leave" &&
        (event.status === "planned" || event.status === "confirmed"),
    )
    .reduce((sum, event) => sum + Math.abs(eventBankMinutes(event)), 0);
  const reservedOrConsumed = summary.reservedMinutes;
  const minutesStillNeeded = Math.max(0, uncoveredLeave - reservedOrConsumed);

  return {
    ...summary,
    futureCreditMinutes,
    projectedMinutes,
    minutesStillNeeded,
    tone:
      projectedMinutes > 0 ? "positive" : projectedMinutes === 0 ? "zero" : "negative",
  };
}

export function formatHours(value: number): string {
  const rounded = Number(value.toFixed(2));
  const sign = rounded > 0 ? "+" : "";
  return `${sign}${rounded} h`;
}
