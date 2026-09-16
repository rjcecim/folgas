"use client";

import { useEffect, useMemo, useState } from "react";
import type { BankHoursSettings, CalendarEvent, CalendarEventInput } from "@/types";
import type { BankAdjustment, BankAllocation, BankParcel, BankParcelInput } from "@/types/bank";
import { DEFAULT_CALENDAR_YEAR, calendarYears } from "@/lib/constants";
import {
  deleteAllocationsForEvent,
  deleteBankParcel,
  markAllocationsConsumed,
  replaceEventAllocations,
  upsertBankParcel,
  watchBankAdjustments,
  watchBankAllocations,
  watchBankParcels,
} from "@/lib/firebase/bank";
import { removeEvent, saveEvent, watchEvents } from "@/lib/firebase/events";
import { saveBankHours, watchBankHours } from "@/lib/firebase/settings";
import { removeTrip, syncTripFromEvent } from "@/lib/firebase/trips";
import {
  LEGACY_PARCEL_ID,
  allocateFromParcels,
  applyEventAllocations,
  expiresOnFromOriginMonth,
  parcelIdFor,
  summarizeBank,
} from "@/lib/utils/bankLedger";
import { todayISO } from "@/lib/utils/dates";
import { eventBankMinutes } from "@/lib/utils/duration";
import { findFreeOpportunities } from "@/lib/utils/opportunities";
import { projectBankHours } from "@/lib/utils/projection";
import type { EventFilterState } from "@/types";

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
  const [parcels, setParcels] = useState<BankParcel[]>([]);
  const [parcelsReady, setParcelsReady] = useState(false);
  const [allocations, setAllocations] = useState<BankAllocation[]>([]);
  const [adjustments, setAdjustments] = useState<BankAdjustment[]>([]);
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
    const stopParcels = watchBankParcels((items) => {
      setParcels(items);
      setParcelsReady(true);
    });
    const stopAllocations = watchBankAllocations(setAllocations);
    const stopAdjustments = watchBankAdjustments(setAdjustments);
    return () => {
      stopEvents();
      stopSettings();
      stopParcels();
      stopAllocations();
      stopAdjustments();
    };
  }, []);

  useEffect(() => {
    if (!settings || !parcelsReady || settings.legacyMigrated) return;
    const migrate = async () => {
      if (parcels.length === 0 && settings.currentBalanceHours !== 0) {
        await upsertBankParcel(
          LEGACY_PARCEL_ID,
          {
            originYear: null,
            originMonth: null,
            extractMinutes: Math.round(settings.currentBalanceHours * 60),
            expiresOn: null,
            reviewedOn: today,
            monthState: "closed",
            notes: "Saldo único anterior à divisão por mês. Validade pendente.",
            kind: "legacy",
          },
          undefined,
          "create",
          "Migração do saldo legado",
        );
      }
      await saveBankHours({
        currentBalanceHours: settings.currentBalanceHours,
        dailyWorkHours: settings.dailyWorkHours,
        legacyMigrated: true,
      });
    };
    void migrate();
  }, [parcels.length, parcelsReady, settings, today]);

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

  const summary = useMemo(
    () => summarizeBank(parcels, allocations, today),
    [allocations, parcels, today],
  );

  const projection = useMemo(() => projectBankHours(summary, events), [events, summary]);
  const dailyWorkHours = settings?.dailyWorkHours ?? 8;

  async function syncLeaveAllocations(event: CalendarEvent) {
    const minutes = Math.abs(eventBankMinutes(event));
    if (event.type !== "bank_hours_leave" || !event.includeInProjection || minutes === 0) {
      await deleteAllocationsForEvent(event.id);
      return;
    }
    const asOf = event.endDate;
    const { picks } = allocateFromParcels(parcels, allocations, minutes, asOf, event.id);
    const mode = event.status === "planned" ? "reserved" : "consumed";
    const next = applyEventAllocations(allocations, event.id, picks, mode, asOf);
    await replaceEventAllocations(
      event.id,
      next.filter((item) => item.eventId === event.id),
    );
  }

  return {
    today,
    events,
    settings,
    parcels,
    allocations,
    adjustments,
    summary,
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
    previewLeaveAllocation(minutes: number, asOf: string, eventId?: string) {
      return allocateFromParcels(parcels, allocations, minutes, asOf, eventId);
    },
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
        await syncLeaveAllocations(nextEvent);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Falha ao salvar o evento.");
        throw err;
      }
    },
    async deleteEvent(current: CalendarEvent) {
      try {
        await deleteAllocationsForEvent(current.id);
        await removeEvent(current.id);
        if (current.type === "trip") await removeTrip(current.id);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Falha ao excluir o evento.");
      }
    },
    async persistDailyWorkHours(dailyWorkHoursValue: number) {
      await saveBankHours({
        currentBalanceHours: summary.registeredMinutes / 60,
        dailyWorkHours: dailyWorkHoursValue,
        legacyMigrated: true,
      });
    },
    async persistParcel(input: BankParcelInput, extractAlreadyIncludesUses: boolean) {
      if (input.originYear == null || input.originMonth == null) return;
      const id = parcelIdFor(input.originYear, input.originMonth);
      const previous = parcels.find((parcel) => parcel.id === id);
      await upsertBankParcel(
        id,
        {
          ...input,
          kind: "parcel",
          expiresOn: input.expiresOn || expiresOnFromOriginMonth(input.originYear, input.originMonth),
        },
        previous,
        previous ? "reconcile" : "create",
      );
      if (extractAlreadyIncludesUses) {
        const related = events.filter(
          (event) =>
            event.type === "bank_hours_leave" &&
            event.status !== "planned" &&
            event.startDate.slice(0, 7) ===
              `${input.originYear}-${String(input.originMonth).padStart(2, "0")}`,
        );
        await Promise.all(related.map((event) => markAllocationsConsumed(event.id)));
      }
    },
    async persistLegacyParcel(input: BankParcelInput) {
      const previous = parcels.find((parcel) => parcel.id === LEGACY_PARCEL_ID);
      await upsertBankParcel(LEGACY_PARCEL_ID, { ...input, kind: "legacy" }, previous, "manual");
    },
    async distributeLegacy(targetYear: number, targetMonth: number, minutes: number) {
      const legacy = parcels.find((parcel) => parcel.id === LEGACY_PARCEL_ID);
      if (!legacy) return;
      const move = Math.min(minutes, legacy.extractMinutes);
      const targetId = parcelIdFor(targetYear, targetMonth);
      const target = parcels.find((parcel) => parcel.id === targetId);
      await upsertBankParcel(
        LEGACY_PARCEL_ID,
        { ...legacy, extractMinutes: legacy.extractMinutes - move },
        legacy,
        "distribute",
        `Distribuiu ${move} min para ${targetId}`,
      );
      await upsertBankParcel(
        targetId,
        {
          originYear: targetYear,
          originMonth: targetMonth,
          extractMinutes: (target?.extractMinutes ?? 0) + move,
          expiresOn: target?.expiresOn ?? expiresOnFromOriginMonth(targetYear, targetMonth),
          reviewedOn: target?.reviewedOn || today,
          monthState: target?.monthState ?? "closed",
          notes: target?.notes ?? "",
          kind: "parcel",
        },
        target,
        "distribute",
        `Recebeu ${move} min do saldo legado`,
      );
    },
    async removeParcel(id: string) {
      await deleteBankParcel(id);
    },
  };
}
