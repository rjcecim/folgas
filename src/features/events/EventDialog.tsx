"use client";

import type { CalendarEvent, CalendarEventInput } from "@/types";
import { Modal } from "@/components/ui/Modal";
import { EventDetails } from "./EventDetails";

export function EventDialog({
  event,
  onClose,
  onDelete,
}: {
  event: CalendarEvent;
  mode?: "create" | "details" | "edit";
  dailyWorkHours?: number;
  onClose: () => void;
  onSave?: (input: CalendarEventInput, current?: CalendarEvent) => Promise<void>;
  onDelete: (current: CalendarEvent) => Promise<void>;
}) {
  return (
    <Modal title={event.title} onClose={onClose}>
      <EventDetails
        event={event}
        onDelete={async () => {
          await onDelete(event);
          onClose();
        }}
      />
    </Modal>
  );
}
