"use client";

import { EVENT_STATUSES, EVENT_TYPES, type EventStatus, type EventType } from "@/types";
import { STATUS_LABELS, TYPE_LABELS, calendarYears } from "@/lib/constants";
import { Field, Select } from "@/components/ui/Field";

export interface EventFilterState {
  year: number;
  type: EventType | "all";
  status: EventStatus | "all";
}

export function EventFilters({
  value,
  onChange,
  years,
}: {
  value: EventFilterState;
  onChange: (value: EventFilterState) => void;
  years?: number[];
}) {
  const yearOptions = years && years.length > 0 ? years : calendarYears();
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      <Field label="Ano">
        <Select
          value={value.year}
          onChange={(event) => onChange({ ...value, year: Number(event.target.value) })}
        >
          {yearOptions.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </Select>
      </Field>
      <Field label="Tipo">
        <Select
          value={value.type}
          onChange={(event) =>
            onChange({ ...value, type: event.target.value as EventFilterState["type"] })
          }
        >
          <option value="all">Todos</option>
          {EVENT_TYPES.map((type) => (
            <option key={type} value={type}>
              {TYPE_LABELS[type]}
            </option>
          ))}
        </Select>
      </Field>
      <Field label="Status">
        <Select
          value={value.status}
          onChange={(event) =>
            onChange({ ...value, status: event.target.value as EventFilterState["status"] })
          }
        >
          <option value="all">Todos</option>
          {EVENT_STATUSES.map((status) => (
            <option key={status} value={status}>
              {STATUS_LABELS[status]}
            </option>
          ))}
        </Select>
      </Field>
    </div>
  );
}
