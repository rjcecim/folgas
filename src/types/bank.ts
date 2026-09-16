export const PARCEL_MONTH_STATES = ["open", "closed"] as const;
export const ALLOCATION_MODES = ["reserved", "consumed"] as const;
export const ADJUSTMENT_REASONS = [
  "create",
  "reconcile",
  "distribute",
  "manual",
  "consume",
  "cancel",
] as const;

export type ParcelMonthState = (typeof PARCEL_MONTH_STATES)[number];
export type AllocationMode = (typeof ALLOCATION_MODES)[number];
export type AdjustmentReason = (typeof ADJUSTMENT_REASONS)[number];

export interface BankParcel {
  id: string;
  originYear: number | null;
  originMonth: number | null;
  extractMinutes: number;
  expiresOn: string | null;
  reviewedOn: string;
  monthState: ParcelMonthState;
  notes: string;
  kind: "parcel" | "legacy";
  createdAt: string;
  updatedAt: string;
}

export interface BankParcelInput {
  originYear: number | null;
  originMonth: number | null;
  extractMinutes: number;
  expiresOn: string | null;
  reviewedOn: string;
  monthState: ParcelMonthState;
  notes: string;
  kind?: "parcel" | "legacy";
}

export interface BankAllocation {
  id: string;
  eventId: string;
  parcelId: string;
  minutes: number;
  mode: AllocationMode;
  asOf: string;
  createdAt: string;
}

export interface BankAdjustment {
  id: string;
  parcelId: string;
  previousMinutes: number;
  nextMinutes: number;
  reason: AdjustmentReason;
  note: string;
  createdAt: string;
}

export interface BankSummary {
  registeredMinutes: number;
  confirmedMinutes: number;
  pendingMinutes: number;
  expiredMinutes: number;
  nearExpiryMinutes: number;
  reservedMinutes: number;
}

export interface AllocationPick {
  parcelId: string;
  minutes: number;
}
