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
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-mute">Calendário</p>
          <h2 className="font-serif text-3xl text-ink">
            {MONTH_LABELS[month]} {year}
          </h2>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="secondary" onClick={() => goMonth(-1)}>
            Anterior
          </Button>
          <Button variant="secondary" onClick={() => goMonth(1)}>
            Próximo
          </Button>
          <label className="sr-only" htmlFor="year-select">
            Ano
          </label>
          <select
            id="year-select"
            className="rounded-full border border-line bg-white px-3 py-2 text-sm"
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

      <div className="mb-2 grid grid-cols-7 gap-1 text-[10px] uppercase tracking-[0.12em] text-mute sm:gap-2 sm:text-xs sm:tracking-[0.16em]">
        {WEEKDAY_LABELS.map((label) => (
          <div key={label} className="px-1 sm:px-2">
            {label}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1 sm:gap-2">
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
