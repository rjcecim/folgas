import type {
  AllocationPick,
  BankAllocation,
  BankParcel,
  BankSummary,
} from "@/types/bank";

export const NEAR_EXPIRY_DAYS = 30;
export const LEGACY_PARCEL_ID = "parcel-legacy";
export const VALIDITY_MONTHS = 4;

export function expiresOnFromOriginMonth(year: number, month: number): string {
  const endOfOrigin = new Date(year, month, 0);
  const day = endOfOrigin.getDate();
  const expires = new Date(endOfOrigin.getFullYear(), endOfOrigin.getMonth() + VALIDITY_MONTHS, day);
  if (expires.getDate() !== day) expires.setDate(0);
  const y = expires.getFullYear();
  const m = String(expires.getMonth() + 1).padStart(2, "0");
  const d = String(expires.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function parcelIdFor(year: number, month: number): string {
  return `parcel-${year}-${String(month).padStart(2, "0")}`;
}

export function parcelLabel(parcel: BankParcel): string {
  if (parcel.kind === "legacy" || parcel.originYear == null || parcel.originMonth == null) {
    return "Saldo legado";
  }
  return `${String(parcel.originMonth).padStart(2, "0")}/${parcel.originYear}`;
}

export function effectiveExpiresOn(parcel: BankParcel): string | null {
  if (parcel.expiresOn) return parcel.expiresOn;
  if (parcel.originYear != null && parcel.originMonth != null) {
    return expiresOnFromOriginMonth(parcel.originYear, parcel.originMonth);
  }
  return null;
}

export function validityLabel(parcel: BankParcel, asOf: string): string {
  const expiresOn = effectiveExpiresOn(parcel);
  if (!expiresOn) return "Validade pendente";
  if (expiresOn < asOf) return "Vencida";
  return `Vence ${expiresOn.split("-").reverse().join("/")}`;
}

function reservedByParcel(
  allocations: BankAllocation[],
  ignoreEventId?: string,
): Record<string, number> {
  const totals: Record<string, number> = {};
  for (const allocation of allocations) {
    if (allocation.mode !== "reserved") continue;
    if (ignoreEventId && allocation.eventId === ignoreEventId) continue;
    totals[allocation.parcelId] = (totals[allocation.parcelId] ?? 0) + allocation.minutes;
  }
  return totals;
}

export function usableMinutes(
  parcel: BankParcel,
  allocations: BankAllocation[],
  asOf: string,
  ignoreEventId?: string,
): number {
  const expiresOn = effectiveExpiresOn(parcel);
  if (!expiresOn || expiresOn < asOf) return 0;
  const reserved = reservedByParcel(allocations, ignoreEventId)[parcel.id] ?? 0;
  return Math.max(0, parcel.extractMinutes - reserved);
}

export function summarizeBank(
  parcels: BankParcel[],
  allocations: BankAllocation[],
  asOf: string,
  nearDays = NEAR_EXPIRY_DAYS,
): BankSummary {
  const reserved = reservedByParcel(allocations);
  let registeredMinutes = 0;
  let confirmedMinutes = 0;
  let pendingMinutes = 0;
  let expiredMinutes = 0;
  let nearExpiryMinutes = 0;
  let reservedMinutes = 0;

  for (const parcel of parcels) {
    registeredMinutes += parcel.extractMinutes;
    reservedMinutes += reserved[parcel.id] ?? 0;

    const expiresOn = effectiveExpiresOn(parcel);
    if (!expiresOn) {
      pendingMinutes += parcel.extractMinutes;
      continue;
    }

    if (expiresOn < asOf) {
      expiredMinutes += parcel.extractMinutes;
      continue;
    }

    const usable = Math.max(0, parcel.extractMinutes - (reserved[parcel.id] ?? 0));
    confirmedMinutes += usable;
    const daysLeft = dayDiff(asOf, expiresOn);
    if (daysLeft <= nearDays) nearExpiryMinutes += usable;
  }

  return {
    registeredMinutes,
    confirmedMinutes,
    pendingMinutes,
    expiredMinutes,
    nearExpiryMinutes,
    reservedMinutes,
  };
}

export function allocateFromParcels(
  parcels: BankParcel[],
  allocations: BankAllocation[],
  minutes: number,
  asOf: string,
  ignoreEventId?: string,
): { picks: AllocationPick[]; shortfall: number } {
  const need = Math.max(0, Math.trunc(minutes));
  const eligible = [...parcels]
    .filter((parcel) => usableMinutes(parcel, allocations, asOf, ignoreEventId) > 0)
    .sort((a, b) => {
      const expire = (effectiveExpiresOn(a) ?? "9999-12-31").localeCompare(
        effectiveExpiresOn(b) ?? "9999-12-31",
      );
      if (expire !== 0) return expire;
      return parcelLabel(a).localeCompare(parcelLabel(b));
    });

  const picks: AllocationPick[] = [];
  let remaining = need;
  for (const parcel of eligible) {
    if (remaining <= 0) break;
    const take = Math.min(usableMinutes(parcel, allocations, asOf, ignoreEventId), remaining);
    if (take > 0) {
      picks.push({ parcelId: parcel.id, minutes: take });
      remaining -= take;
    }
  }

  return { picks, shortfall: remaining };
}

export function restoreAllocations(
  current: BankAllocation[],
  eventId: string,
): BankAllocation[] {
  return current.filter((allocation) => allocation.eventId !== eventId);
}

export function applyEventAllocations(
  current: BankAllocation[],
  eventId: string,
  picks: AllocationPick[],
  mode: BankAllocation["mode"],
  asOf: string,
  now = new Date().toISOString(),
): BankAllocation[] {
  const withoutEvent = restoreAllocations(current, eventId);
  return [
    ...withoutEvent,
    ...picks.map((pick) => ({
      id: `alloc-${eventId}-${pick.parcelId}`,
      eventId,
      parcelId: pick.parcelId,
      minutes: pick.minutes,
      mode,
      asOf,
      createdAt: now,
    })),
  ];
}

export function markEventConsumed(
  current: BankAllocation[],
  eventId: string,
): BankAllocation[] {
  return current.map((allocation) =>
    allocation.eventId === eventId ? { ...allocation, mode: "consumed" } : allocation,
  );
}

export function replaceExtractMinutes(parcel: BankParcel, nextMinutes: number): BankParcel {
  return {
    ...parcel,
    extractMinutes: Math.trunc(nextMinutes),
    updatedAt: new Date().toISOString(),
  };
}

export function moveLegacyMinutes(
  parcels: BankParcel[],
  minutes: number,
  targetId: string,
): BankParcel[] {
  const legacy = parcels.find((parcel) => parcel.id === LEGACY_PARCEL_ID);
  const target = parcels.find((parcel) => parcel.id === targetId);
  if (!legacy || !target) return parcels;
  const move = Math.min(Math.max(0, Math.trunc(minutes)), legacy.extractMinutes);
  return parcels.map((parcel) => {
    if (parcel.id === LEGACY_PARCEL_ID) {
      return { ...parcel, extractMinutes: parcel.extractMinutes - move };
    }
    if (parcel.id === targetId) {
      return { ...parcel, extractMinutes: parcel.extractMinutes + move };
    }
    return parcel;
  });
}

function dayDiff(from: string, to: string): number {
  const start = Date.parse(`${from}T00:00:00`);
  const end = Date.parse(`${to}T00:00:00`);
  return Math.round((end - start) / 86_400_000);
}
