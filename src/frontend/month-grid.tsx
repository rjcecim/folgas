"use client";

import type { CalendarEvent } from "@/types";
import { MONTH_LABELS, WEEKDAY_LABELS, calendarYears } from "@/lib/constants";
import { daysInMonthGrid, isDateInRange, isWeekend, parseISODate, todayISO } from "@/lib/utils/dates";
import { TYPE_COLOR } from "./colors";
import { Btn } from "./ui";

export function MonthGrid({
  year,
  month,
  events,
  years,
  onYearChange,
  onMonthChange,
  onSelect,
}: {
  year: number;
  month: number;
  events: CalendarEvent[];
  years?: number[];
  onYearChange: (year: number) => void;
  onMonthChange: (month: number) => void;
  onSelect: (event: CalendarEvent) => void;
}) {
  const yearOptions = years && years.length > 0 ? years : calendarYears([year]);
  const cells = daysInMonthGrid(year, month);
  const today = todayISO();

  const go = (delta: number) => {
    const next = new Date(year, month + delta, 1);
    onYearChange(next.getFullYear());
    onMonthChange(next.getMonth());
  };

  return (
    <section>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <h1 className="text-5xl font-semibold tracking-tight sm:text-6xl">
          {MONTH_LABELS[month]}
          <span className="ml-3 text-soft">{year}</span>
        </h1>
        <div className="flex items-center gap-2">
          <Btn tone="quiet" onClick={() => go(-1)}>
            Anterior
          </Btn>
          <Btn tone="quiet" onClick={() => go(1)}>
            Próximo
          </Btn>
          <select
            className="h-10 rounded-full bg-white px-4 text-sm ring-1 ring-hair"
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

      <div className="grid grid-cols-7 gap-1.5 rounded-[28px] bg-well p-3 ring-1 ring-hair sm:gap-2 sm:p-4">
        {WEEKDAY_LABELS.map((label) => (
          <div key={label} className="px-2 pb-2 text-sm text-soft">
            {label}
          </div>
        ))}
        {cells.map((cell) => {
          const dayEvents = events.filter((event) =>
            isDateInRange(cell.date, event.startDate, event.endDate),
          );
          const isToday = cell.date === today;
          const outside = !cell.inMonth;
          const muted = outside || isWeekend(cell.date);
          const date = parseISODate(cell.date);
          const monthHint = MONTH_LABELS[date.getMonth()].slice(0, 3).toLowerCase();

          return (
            <div
              key={cell.date}
              className={`min-h-28 rounded-2xl px-2 py-2 ring-1 ${
                outside ? "bg-white/45" : "bg-white"
              } ${isToday ? "ring-accent" : outside ? "ring-hair/60" : "ring-hair"} ${
                muted ? "text-soft" : ""
              }`}
            >
              <div className="flex items-center gap-1">
                <span
                  className={`inline-flex h-8 w-8 items-center justify-center rounded-full text-sm ${
                    isToday ? "bg-accent font-semibold text-white" : ""
                  } ${outside && !isToday ? "opacity-60" : ""}`}
                >
                  {date.getDate()}
                </span>
                {outside ? <span className="text-[11px] text-soft">{monthHint}</span> : null}
              </div>
              <div className={`mt-1 space-y-1 ${outside ? "opacity-60" : ""}`}>
                {dayEvents.slice(0, 3).map((event) => (
                  <button
                    key={event.id}
                    type="button"
                    onClick={() => onSelect(event)}
                    className="flex w-full items-center gap-1.5 text-left"
                  >
                    <span
                      className="h-1.5 w-1.5 shrink-0 rounded-full"
                      style={{ background: TYPE_COLOR[event.type] }}
                    />
                    <span className="truncate text-xs">{event.title}</span>
                  </button>
                ))}
                {dayEvents.length > 3 ? (
                  <p className="text-[11px] text-soft">+{dayEvents.length - 3}</p>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
