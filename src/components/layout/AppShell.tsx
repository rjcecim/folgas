"use client";

import { useEffect, useMemo, useState } from "react";
import type { BankHoursSettings, CalendarEvent, CalendarEventInput } from "@/types";
import { Card } from "@/components/ui/Card";
import { Legend } from "@/components/dashboard/Legend";
import { UpcomingList } from "@/components/dashboard/UpcomingList";
import { AppHeader } from "@/components/layout/AppHeader";
import { BankHoursCard } from "@/features/bank-hours/BankHoursCard";
import { BankHoursForm } from "@/features/bank-hours/BankHoursForm";
import { CalendarMonth } from "@/features/calendar/CalendarMonth";
import { EventDialog } from "@/features/events/EventDialog";
import { EventFilters, type EventFilterState } from "@/features/events/EventFilters";
import { OpportunitiesCard } from "@/features/opportunities/OpportunitiesCard";
import { UpcomingTrips } from "@/features/trips/UpcomingTrips";
import { DEFAULT_CALENDAR_YEAR, calendarYears } from "@/lib/constants";
import { removeEvent, saveEvent, watchEvents } from "@/lib/firebase/events";
import { saveBankHours, watchBankHours } from "@/lib/firebase/settings";
import { removeTrip, syncTripFromEvent } from "@/lib/firebase/trips";
import { todayISO } from "@/lib/utils/dates";
import { findFreeOpportunities } from "@/lib/utils/opportunities";
import { projectBankHours } from "@/lib/utils/projection";

const OFFICIAL_FREE_TYPES = new Set([
  "national_holiday",
  "municipal_holiday",
  "optional_day",
  "work_suspension",
  "recess",
]);

export function AppShell() {
  const today = todayISO();
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [settings, setSettings] = useState<BankHoursSettings | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [filters, setFilters] = useState<EventFilterState>({
    year: DEFAULT_CALENDAR_YEAR,
    type: "all",
    status: "all",
  });
  const [month, setMonth] = useState(() => new Date().getMonth());
  const [dialog, setDialog] = useState<
    { mode: "create" } | { mode: "details" | "edit"; event: CalendarEvent } | null
  >(null);

  useEffect(() => {
    const stopEvents = watchEvents(setEvents);
    const stopSettings = watchBankHours(setSettings);
    return () => {
      stopEvents();
      stopSettings();
    };
  }, []);

  const filteredEvents = useMemo(
    () =>
      events.filter((event) => {
        const inYear =
          event.startDate.startsWith(String(filters.year)) ||
          event.endDate.startsWith(String(filters.year));
        const typeOk = filters.type === "all" || event.type === filters.type;
        const statusOk = filters.status === "all" || event.status === filters.status;
        return inYear && typeOk && statusOk;
      }),
    [events, filters],
  );

  const projection = useMemo(
    () =>
      projectBankHours(
        settings ?? { currentBalanceHours: 0, dailyWorkHours: 8, updatedAt: "" },
        events,
      ),
    [events, settings],
  );

  const upcomingOffDays = events
    .filter((event) => OFFICIAL_FREE_TYPES.has(event.type) && event.endDate >= today)
    .slice(0, 5);
  const upcomingLeaves = events
    .filter((event) => event.type === "bank_hours_leave" && event.endDate >= today)
    .slice(0, 5);
  const upcomingTrips = events
    .filter((event) => event.type === "trip" && event.endDate >= today)
    .slice(0, 5);
  const years = useMemo(() => {
    const fromEvents = events.flatMap((event) => [
      Number(event.startDate.slice(0, 4)),
      Number(event.endDate.slice(0, 4)),
    ]);
    return calendarYears(fromEvents.filter((year) => Number.isFinite(year)));
  }, [events]);
  const opportunities = findFreeOpportunities(
    events,
    filters.year,
    today,
    settings?.dailyWorkHours ?? 8,
  );

  async function persistEvent(input: CalendarEventInput, current?: CalendarEvent) {
    const id = current?.id ?? `evt-${crypto.randomUUID()}`;
    try {
      await saveEvent(id, input, !current);
      const nextEvent: CalendarEvent = {
        id,
        ...input,
        createdAt: current?.createdAt ?? new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      if (input.type === "trip") {
        await syncTripFromEvent(nextEvent);
      } else if (current?.type === "trip") {
        await removeTrip(id);
      }
    } catch (error) {
      setLoadError(error instanceof Error ? error.message : "Falha ao salvar o evento.");
      throw error;
    }
  }

  async function deleteEvent(current: CalendarEvent) {
    try {
      await removeEvent(current.id);
      if (current.type === "trip") {
        await removeTrip(current.id);
      }
    } catch (error) {
      setLoadError(error instanceof Error ? error.message : "Falha ao excluir o evento.");
    }
  }

  return (
    <div className="min-h-screen">
      <AppHeader onCreate={() => setDialog({ mode: "create" })} />
      <main className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6">
        {loadError ? <p className="text-sm text-rose-700">{loadError}</p> : null}

        <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <BankHoursCard
            projection={projection}
            dailyWorkHours={settings?.dailyWorkHours ?? 8}
          />
          <Card title="Saldo e jornada">
            {settings ? (
              <BankHoursForm
                settings={settings}
                onSave={async (values) => {
                  await saveBankHours(values);
                }}
              />
            ) : (
              <p className="text-sm text-mute">Carregando saldo...</p>
            )}
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <UpcomingList
            title="Próximos dias sem expediente"
            events={upcomingOffDays}
            empty="Nenhum dia sem expediente à frente."
            onSelect={(event) => setDialog({ mode: "details", event })}
          />
          <UpcomingList
            title="Próximas folgas com banco"
            events={upcomingLeaves}
            empty="Nenhuma folga de banco planejada."
            onSelect={(event) => setDialog({ mode: "details", event })}
          />
          <UpcomingTrips
            trips={upcomingTrips}
            onSelect={(event) => setDialog({ mode: "details", event })}
          />
        </div>

        <OpportunitiesCard periods={opportunities} />

        <Card>
          <div className="mb-5 space-y-4">
            <EventFilters
              value={filters}
              years={years}
              onChange={(next) => {
                setFilters(next);
                if (next.year !== filters.year) {
                  setMonth(0);
                }
              }}
            />
            <p className="text-sm text-mute">
              Todos os dias são seus. Crie, edite ou exclua, inclusive os do ano que vem, em Novo
              evento.
            </p>
            <Legend />
          </div>
          <CalendarMonth
            year={filters.year}
            month={month}
            events={filteredEvents}
            onYearChange={(year) => setFilters((current) => ({ ...current, year }))}
            onMonthChange={setMonth}
            onSelectEvent={(event) => setDialog({ mode: "details", event })}
            years={years}
          />
        </Card>
      </main>

      {dialog ? (
        <EventDialog
          mode={dialog.mode}
          event={dialog.mode === "create" ? undefined : dialog.event}
          dailyWorkHours={settings?.dailyWorkHours ?? 8}
          onClose={() => setDialog(null)}
          onSave={persistEvent}
          onDelete={deleteEvent}
        />
      ) : null}
    </div>
  );
}
