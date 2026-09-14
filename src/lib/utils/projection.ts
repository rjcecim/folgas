import type { BankHoursSettings, CalendarEvent } from "@/types";

export interface BankHoursProjection {
  currentBalanceHours: number;
  plannedLeaveHours: number;
  futureCreditHours: number;
  projectedBalanceHours: number;
  hoursStillNeeded: number;
  tone: "positive" | "zero" | "negative";
}

export function projectBankHours(
  settings: BankHoursSettings,
  events: CalendarEvent[],
): BankHoursProjection {
  const relevant = events.filter((event) => event.includeInProjection);
  const plannedLeaveHours = relevant
    .filter((event) => event.bankHoursImpact < 0)
    .reduce((sum, event) => sum + event.bankHoursImpact, 0);
  const futureCreditHours = relevant
    .filter((event) => event.bankHoursImpact > 0)
    .reduce((sum, event) => sum + event.bankHoursImpact, 0);
  const projectedBalanceHours =
    settings.currentBalanceHours + plannedLeaveHours + futureCreditHours;
  const hoursStillNeeded =
    projectedBalanceHours < 0 ? Math.abs(projectedBalanceHours) : 0;

  return {
    currentBalanceHours: settings.currentBalanceHours,
    plannedLeaveHours,
    futureCreditHours,
    projectedBalanceHours,
    hoursStillNeeded,
    tone:
      projectedBalanceHours > 0
        ? "positive"
        : projectedBalanceHours === 0
          ? "zero"
          : "negative",
  };
}

export function formatHours(value: number): string {
  const rounded = Number(value.toFixed(2));
  const sign = rounded > 0 ? "+" : "";
  return `${sign}${rounded} h`;
}
