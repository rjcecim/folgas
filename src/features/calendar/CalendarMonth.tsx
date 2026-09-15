"use client";

import type { CalendarEvent } from "@/types";
import { Button } from "@/components/ui/Button";
import { MONTH_LABELS, WEEKDAY_LABELS, calendarYears } from "@/lib/constants";
import { daysInMonthGrid, isDateInRange } from "@/lib/utils/dates";
import { CalendarDay } from "./CalendarDay";

export function CalendarMonth({
  year,
  month,
  events,
  onYearChange,
  onMonthChange,
  onSelectEvent,
  years,
}: {
  year: number;
  month: number;
  events: CalendarEvent[];
  onYearChange: (year: number) => void;
  onMonthChange: (month: number) => void;
  onSelectEvent: (event: CalendarEvent) => void;
  years?: number[];
}) {
  const yearOptions = years && years.length > 0 ? years : calendarYears([year]);
  const cells = daysInMonthGrid(year, month);

  const goMonth = (delta: number) => {
    const next = new Date(year, month + delta, 1);
    onYearChange(next.getFullYear());
    onMonthChange(next.getMonth());
  };

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          {MONTH_LABELS[month]}
          <span className="ml-2 text-mute">{year}</span>
        </h2>
        <div className="flex items-center gap-2">
          <Button variant="secondary" onClick={() => goMonth(-1)}>
            ‹
          </Button>
          <Button variant="secondary" onClick={() => goMonth(1)}>
            ›
          </Button>
          <select
            className="h-9 rounded-full border border-line bg-sand px-3 text-sm"
            value={year}
            onChange={(event) => onYearChange(Number(event.target.value))}
          >
            {yearOptions.map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mb-2 grid grid-cols-7 text-[11px] font-medium text-mute">
        {WEEKDAY_LABELS.map((label) => (
          <div key={label} className="px-2 py-1">
            {label}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1.5">
        {cells.map((date, index) => (
          <CalendarDay
            key={date ?? `empty-${index}`}
            date={date}
            events={
              date
                ? events.filter((event) => isDateInRange(date, event.startDate, event.endDate))
                : []
            }
            onSelect={onSelectEvent}
          />
        ))}
      </div>
    </div>
  );
}
