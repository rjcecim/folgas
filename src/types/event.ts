export const EVENT_TYPES = [
  "national_holiday",
  "municipal_holiday",
  "optional_day",
  "work_suspension",
  "recess",
  "bank_hours_leave",
  "future_bank_credit",
  "trip",
  "other",
] as const;

export const EVENT_STATUSES = ["official", "planned", "confirmed"] as const;

export type EventType = (typeof EVENT_TYPES)[number];
export type EventStatus = (typeof EVENT_STATUSES)[number];

export interface CalendarEvent {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  type: EventType;
  nature: string;
  official: boolean;
  status: EventStatus;
  bankHoursImpact: number;
  bankMinutesImpact: number;
  includeInProjection: boolean;
  legalBasis: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export type CalendarEventInput = Omit<
  CalendarEvent,
  "id" | "createdAt" | "updatedAt"
>;
