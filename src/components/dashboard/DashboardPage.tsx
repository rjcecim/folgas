"use client";

import { useState } from "react";
import Link from "next/link";
import type { CalendarEvent } from "@/types";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Legend } from "@/components/dashboard/Legend";
import { UpcomingList } from "@/components/dashboard/UpcomingList";
import { DashboardStats } from "@/components/dashboard/DashboardStats";
import { AppHeader } from "@/components/layout/AppHeader";
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
    <div className="min-h-screen">
      <AppHeader />
      <main className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6">
        {planner.error ? <p className="text-sm text-rose-700">{planner.error}</p> : null}

        <DashboardStats
          projection={planner.projection}
          dailyWorkHours={planner.dailyWorkHours}
        />

        <div className="grid gap-4 lg:grid-cols-3">
          <UpcomingList
            title="Sem expediente"
            events={planner.upcomingOffDays}
            empty="Nenhum dia à frente."
            onSelect={setSelected}
          />
          <UpcomingList
            title="Folgas no banco"
            events={planner.upcomingLeaves}
            empty="Nenhuma folga planejada."
            onSelect={setSelected}
          />
          <UpcomingTrips trips={planner.upcomingTrips} onSelect={setSelected} />
        </div>

        <OpportunitiesCard periods={planner.opportunities} />

        <Card
          title="Calendário"
          action={
            <Link href="/cadastro/">
              <Button variant="secondary">Cadastrar dias</Button>
            </Link>
          }
        >
          <div className="mb-5 space-y-4">
            <EventFilters
              value={planner.filters}
              years={planner.years}
              onChange={(next) => {
                planner.setFilters(next);
                if (next.year !== planner.filters.year) planner.setMonth(0);
              }}
            />
            <Legend />
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
        </Card>
      </main>

      {selected ? (
        <EventDialog
          mode="details"
          event={selected}
          dailyWorkHours={planner.dailyWorkHours}
          onClose={() => setSelected(null)}
          onSave={planner.persistEvent}
          onDelete={async (event) => {
            await planner.deleteEvent(event);
            setSelected(null);
          }}
        />
      ) : null}
    </div>
  );
}
