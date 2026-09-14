import type { CalendarEvent } from "@/types";
import { addDays, eachDateInRange, isWeekend, todayISO } from "./dates";

export interface FreePeriod {
  startDate: string;
  endDate: string;
  days: number;
  costHours: number;
  kind: "existing" | "bridge";
  title: string;
}

const OFFICIAL_FREE_TYPES = new Set([
  "national_holiday",
  "municipal_holiday",
  "optional_day",
  "work_suspension",
  "recess",
]);

function coversDate(event: CalendarEvent, date: string) {
  return date >= event.startDate && date <= event.endDate;
}

function isKnownOffDay(events: CalendarEvent[], date: string) {
  return events.some(
    (event) => OFFICIAL_FREE_TYPES.has(event.type) && coversDate(event, date),
  );
}

function bankLeaveCost(events: CalendarEvent[], date: string) {
  return events
    .filter((event) => event.type === "bank_hours_leave" && coversDate(event, date))
    .reduce((sum, event) => sum + Math.abs(event.bankHoursImpact), 0);
}

function isFreeDay(events: CalendarEvent[], date: string) {
  return isWeekend(date) || isKnownOffDay(events, date) || bankLeaveCost(events, date) > 0;
}

export function findFreeOpportunities(
  events: CalendarEvent[],
  year: number,
  fromDate = todayISO(),
): FreePeriod[] {
  const start = `${year}-01-01`;
  const end = `${year}-12-31`;
  const dates = eachDateInRange(start, end);
  const periods: FreePeriod[] = [];

  let runStart: string | null = null;
  let runCost = 0;

  const flush = (runEnd: string) => {
    if (!runStart) return;
    const days = eachDateInRange(runStart, runEnd).length;
    if (days >= 3 && runEnd >= fromDate) {
      periods.push({
        startDate: runStart,
        endDate: runEnd,
        days,
        costHours: runCost,
        kind: "existing",
        title:
          runCost > 0
            ? `${days} dias consecutivos livres`
            : `${days} dias livres sem usar banco`,
      });
    }
    runStart = null;
    runCost = 0;
  };

  for (const date of dates) {
    if (isFreeDay(events, date)) {
      if (!runStart) runStart = date;
      runCost += bankLeaveCost(events, date);
    } else if (runStart) {
      flush(addDays(date, -1));
    }
  }
  if (runStart) flush(end);

  for (const date of dates) {
    if (date < fromDate || isFreeDay(events, date) || isWeekend(date)) continue;
    const before = addDays(date, -1);
    const after = addDays(date, 1);
    if (!isFreeDay(events, before) && !isFreeDay(events, after)) continue;

    const left = expandFree(events, before, -1);
    const right = expandFree(events, after, 1);
    const days = eachDateInRange(left, right).length;
    if (days >= 3) {
      periods.push({
        startDate: left,
        endDate: right,
        days,
        costHours: 8,
        kind: "bridge",
        title: `Ponte de ${days} dias com 1 folga no banco`,
      });
    }
  }

  return periods
    .sort((a, b) => a.startDate.localeCompare(b.startDate) || b.days - a.days)
    .filter(
      (period, index, list) =>
        list.findIndex(
          (item) =>
            item.startDate === period.startDate &&
            item.endDate === period.endDate &&
            item.kind === period.kind,
        ) === index,
    )
    .slice(0, 8);
}

function expandFree(events: CalendarEvent[], date: string, step: -1 | 1) {
  let cursor = date;
  while (isFreeDay(events, cursor)) {
    const next = addDays(cursor, step);
    if (!isFreeDay(events, next)) break;
    cursor = next;
  }
  return cursor;
}
