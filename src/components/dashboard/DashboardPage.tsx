"use client";

import { useState } from "react";
import Link from "next/link";
import type { CalendarEvent } from "@/types";
import { Button } from "@/components/ui/Button";
import { Legend } from "@/components/dashboard/Legend";
import { UpcomingList } from "@/components/dashboard/UpcomingList";
import { DashboardStats } from "@/components/dashboard/DashboardStats";
import { AppShell } from "@/components/layout/AppShell";
import { CalendarMonth } from "@/features/calendar/CalendarMonth";
import { EventDialog } from "@/features/events/EventDialog";
import { EventFilters } from "@/features/events/EventFilters";
import { OpportunitiesCard } from "@/features/opportunities/OpportunitiesCard";
import { UpcomingTrips } from "@/features/trips/UpcomingTrips";
import { usePlanner } from "@/features/planner/usePlanner";

export function DashboardPage() {
  const planner = usePlanner();
  const [selected, setSelected] = useState<CalendarEvent | null>(null);

  return (
    <AppShell projection={planner.projection} dailyWorkHours={planner.dailyWorkHours}>
      <main className="mx-auto w-full max-w-6xl space-y-6 px-4 py-6 sm:px-6 lg:py-8">
        {planner.error ? <p className="text-sm text-red-400">{planner.error}</p> : null}

        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-sm text-mute">Sua agenda</p>
            <h1 className="mt-1 text-3xl font-semibold tracking-tight sm:text-4xl">O mês à frente</h1>
          </div>
          <Link href="/cadastro/">
            <Button>Novo dia</Button>
          </Link>
        </div>

        <DashboardStats
          projection={planner.projection}
          dailyWorkHours={planner.dailyWorkHours}
        />

        <section className="rounded-3xl border border-line/80 bg-surface/80 p-4 sm:p-6">
          <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <EventFilters
              value={planner.filters}
              years={planner.years}
              onChange={(next) => {
                planner.setFilters(next);
                if (next.year !== planner.filters.year) planner.setMonth(0);
              }}
            />
          </div>
          <CalendarMonth
            year={planner.filters.year}
            month={planner.month}
            events={planner.filteredEvents}
            onYearChange={(year) => planner.setFilters((current) => ({ ...current, year }))}
            onMonthChange={planner.setMonth}
            onSelectEvent={setSelected}
            years={planner.years}
          />
          <div className="mt-5">
            <Legend />
          </div>
        </section>

        <OpportunitiesCard periods={planner.opportunities} />

        <div className="grid gap-3 lg:grid-cols-3">
          <UpcomingList
            title="Próximos dias"
            events={planner.upcomingOffDays}
            empty="Nada à frente."
            onSelect={setSelected}
          />
          <UpcomingList
            title="Folgas"
            events={planner.upcomingLeaves}
            empty="Nenhuma folga."
            onSelect={setSelected}
          />
          <UpcomingTrips trips={planner.upcomingTrips} onSelect={setSelected} />
        </div>
      </main>

      {selected ? (
        <EventDialog
          event={selected}
          onClose={() => setSelected(null)}
          onDelete={async (event) => {
            await planner.deleteEvent(event);
            setSelected(null);
          }}
        />
      ) : null}
    </AppShell>
  );
}
