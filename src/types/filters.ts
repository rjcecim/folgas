import type { EventStatus, EventType } from "./event";

export interface EventFilterState {
  year: number;
  type: EventType | "all";
  status: EventStatus | "all";
}
