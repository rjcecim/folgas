"use client";

import { useEffect, useMemo, useState } from "react";
import type { BankHoursSettings, CalendarEvent, CalendarEventInput } from "@/types";
import { DEFAULT_CALENDAR_YEAR, calendarYears } from "@/lib/constants";
import { removeEvent, saveEvent, watchEvents } from "@/lib/firebase/events";
import { saveBankHours, watchBankHours } from "@/lib/firebase/settings";
import { removeTrip, syncTripFromEvent } from "@/lib/firebase/trips";
import { todayISO } from "@/lib/utils/dates";
import { findFreeOpportunities } from "@/lib/utils/opportunities";
import { projectBankHours } from "@/lib/utils/projection";
import type { EventFilterState } from "@/features/events/EventFilters";

const OFF_TYPES = new Set([
  "national_holiday",
  "municipal_holiday",
  "optional_day",
  "work_suspension",
  "recess",
]);

export function usePlanner() {
  const today = todayISO();
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [settings, setSettings] = useState<BankHoursSettings | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<EventFilterState>({
    year: DEFAULT_CALENDAR_YEAR,
    type: "all",
    status: "all",
  });
  const [month, setMonth] = useState(() => new Date().getMonth());

  useEffect(() => {
    const stopEvents = watchEvents(setEvents);
    const stopSettings = watchBankHours(setSettings);
    return () => {
      stopEvents();
      stopSettings();
    };
  }, []);

  const years = useMemo(() => {
    const fromEvents = events.flatMap((event) => [
      Number(event.startDate.slice(0, 4)),
      Number(event.endDate.slice(0, 4)),
    ]);
    return calendarYears(fromEvents.filter((year) => Number.isFinite(year)));
  }, [events]);

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

  const dailyWorkHours = settings?.dailyWorkHours ?? 8;

  return {
    today,
    events,
    settings,
    error,
    filters,
    setFilters,
    month,
    setMonth,
    years,
    filteredEvents,
    projection,
    dailyWorkHours,
    upcomingOffDays: events
      .filter((event) => OFF_TYPES.has(event.type) && event.endDate >= today)
      .slice(0, 5),
    upcomingLeaves: events
      .filter((event) => event.type === "bank_hours_leave" && event.endDate >= today)
      .slice(0, 5),
    upcomingTrips: events
      .filter((event) => event.type === "trip" && event.endDate >= today)
      .slice(0, 5),
    opportunities: findFreeOpportunities(events, filters.year, today, dailyWorkHours),
    async persistEvent(input: CalendarEventInput, current?: CalendarEvent) {
      const id = current?.id ?? `evt-${crypto.randomUUID()}`;
      try {
        await saveEvent(id, input, !current);
        const nextEvent: CalendarEvent = {
          id,
          ...input,
          createdAt: current?.createdAt ?? new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        if (input.type === "trip") await syncTripFromEvent(nextEvent);
        else if (current?.type === "trip") await removeTrip(id);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Falha ao salvar o evento.");
        throw err;
      }
    },
    async deleteEvent(current: CalendarEvent) {
      try {
        await removeEvent(current.id);
        if (current.type === "trip") await removeTrip(current.id);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Falha ao excluir o evento.");
      }
    },
    async persistBankHours(values: { currentBalanceHours: number; dailyWorkHours: number }) {
      await saveBankHours(values);
    },
  };
}
