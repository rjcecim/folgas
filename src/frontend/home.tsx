"use client";

import { useState } from "react";
import Link from "next/link";
import type { CalendarEvent } from "@/types";
import { TYPE_LABELS } from "@/lib/constants";
import { formatDateRange } from "@/lib/utils/dates";
import { formatHours } from "@/lib/utils/projection";
import { usePlanner } from "@/features/planner/usePlanner";
import { TYPE_COLOR } from "./colors";
import { EventSheet } from "./event-sheet";
import { Filters } from "./filters";
import { Frame } from "./frame";
import { MonthGrid } from "./month-grid";
import { Btn } from "./ui";

export function HomeScreen() {
  const planner = usePlanner();
  const [selected, setSelected] = useState<CalendarEvent | null>(null);
  const upcoming = [
    ...planner.upcomingOffDays,
    ...planner.upcomingLeaves,
    ...planner.upcomingTrips,
  ]
    .filter((event, index, list) => list.findIndex((item) => item.id === event.id) === index)
    .sort((a, b) => a.startDate.localeCompare(b.startDate))
    .slice(0, 6);

  return (
    <Frame>
      <main className="mx-auto max-w-7xl px-4 pb-16 pt-6 sm:px-6">
        {planner.error ? <p className="mb-4 text-sm text-red-600">{planner.error}</p> : null}

        <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-baseline gap-x-6 gap-y-2 text-sm">
            <p>
              <span className="text-soft">Agora </span>
              <strong>{formatHours(planner.projection.currentBalanceHours)}</strong>
            </p>
            <p>
              <span className="text-soft">Projetado </span>
              <strong
                className={
                  planner.projection.tone === "negative"
                    ? "text-red-600"
                    : planner.projection.tone === "zero"
                      ? "text-amber-600"
                      : "text-accent"
                }
              >
                {formatHours(planner.projection.projectedBalanceHours)}
              </strong>
            </p>
            <p className="text-soft">
              {planner.dailyWorkHours} h/dia
              {planner.projection.hoursStillNeeded > 0
                ? ` · faltam ${planner.projection.hoursStillNeeded} h`
                : " · coberto"}
            </p>
          </div>
          <Link href="/cadastro/">
            <Btn>Novo dia</Btn>
          </Link>
        </div>

        <div className="mb-6 max-w-3xl rounded-[28px] bg-white p-4 ring-1 ring-hair">
          <Filters
            value={planner.filters}
            years={planner.years}
            onChange={(next) => {
              planner.setFilters(next);
              if (next.year !== planner.filters.year) planner.setMonth(0);
            }}
          />
        </div>

        <MonthGrid
          year={planner.filters.year}
          month={planner.month}
          events={planner.filteredEvents}
          years={planner.years}
          onYearChange={(year) => planner.setFilters((current) => ({ ...current, year }))}
          onMonthChange={planner.setMonth}
          onSelect={setSelected}
        />

        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          <section className="rounded-[28px] bg-white p-5 ring-1 ring-hair">
            <h2 className="text-sm text-soft">Em seguida</h2>
            {upcoming.length === 0 ? (
              <p className="mt-3 text-sm text-soft">Nada à frente.</p>
            ) : (
              <ul className="mt-3 space-y-2">
                {upcoming.map((event) => (
                  <li key={event.id}>
                    <button
                      type="button"
                      onClick={() => setSelected(event)}
                      className="flex w-full items-center gap-3 rounded-2xl px-3 py-2 text-left ring-1 ring-hair hover:bg-well"
                    >
                      <span
                        className="h-2.5 w-2.5 shrink-0 rounded-full"
                        style={{ background: TYPE_COLOR[event.type] }}
                      />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate font-medium">{event.title}</span>
                        <span className="text-sm text-soft">
                          {formatDateRange(event.startDate, event.endDate)} · {TYPE_LABELS[event.type]}
                        </span>
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="rounded-[28px] bg-white p-5 ring-1 ring-hair">
            <h2 className="text-sm text-soft">Pontes</h2>
            {planner.opportunities.length === 0 ? (
              <p className="mt-3 text-sm text-soft">Nenhuma ponte à frente neste ano.</p>
            ) : (
              <ul className="mt-3 space-y-2">
                {planner.opportunities.map((period) => (
                  <li
                    key={`${period.kind}-${period.startDate}-${period.endDate}`}
                    className="rounded-2xl bg-well px-4 py-3 ring-1 ring-hair"
                  >
                    <p className="font-medium">{period.title}</p>
                    <p className="mt-1 text-sm text-soft">
                      {formatDateRange(period.startDate, period.endDate)} ·{" "}
                      {formatHours(-Math.abs(period.costHours))}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </main>

      {selected ? (
        <EventSheet
          event={selected}
          onClose={() => setSelected(null)}
          onDelete={planner.deleteEvent}
        />
      ) : null}
    </Frame>
  );
}
