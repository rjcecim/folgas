export function hoursMinutesToMinutes(hours: number, minutes: number): number {
  const safeHours = Number.isFinite(hours) ? Math.trunc(hours) : 0;
  const safeMinutes = Number.isFinite(minutes) ? Math.trunc(minutes) : 0;
  return safeHours * 60 + safeMinutes;
}

export function minutesToHoursMinutes(total: number): { hours: number; minutes: number } {
  const sign = total < 0 ? -1 : 1;
  const abs = Math.abs(Math.trunc(total));
  return {
    hours: sign * Math.floor(abs / 60),
    minutes: abs % 60,
  };
}

export function formatDuration(totalMinutes: number): string {
  const sign = totalMinutes < 0 ? "-" : "";
  const abs = Math.abs(Math.trunc(totalMinutes));
  const hours = Math.floor(abs / 60);
  const minutes = abs % 60;
  return `${sign}${hours}h${String(minutes).padStart(2, "0")}`;
}

export function eventBankMinutes(event: {
  bankMinutesImpact?: number;
  bankHoursImpact: number;
}): number {
  if (typeof event.bankMinutesImpact === "number" && Number.isFinite(event.bankMinutesImpact)) {
    return Math.trunc(event.bankMinutesImpact);
  }
  return Math.round(event.bankHoursImpact * 60);
}
