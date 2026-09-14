"use client";

import { useState } from "react";
import type { CalendarEvent, CalendarEventInput } from "@/types";
import { Modal } from "@/components/ui/Modal";
import { EventDetails } from "./EventDetails";
import { EventForm } from "./EventForm";

export function EventDialog({
  event,
  mode,
  dailyWorkHours,
  onClose,
  onSave,
  onDelete,
}: {
  event?: CalendarEvent;
  mode: "create" | "details" | "edit";
  dailyWorkHours: number;
  onClose: () => void;
  onSave: (input: CalendarEventInput, current?: CalendarEvent) => Promise<void>;
  onDelete: (current: CalendarEvent) => Promise<void>;
}) {
  const [currentMode, setCurrentMode] = useState(mode);
  const title =
    currentMode === "create"
      ? "Novo evento"
      : currentMode === "edit"
        ? "Editar evento"
        : event?.title || "Evento";

  return (
    <Modal title={title} onClose={onClose}>
      {currentMode === "details" && event ? (
        <EventDetails
          event={event}
          onEdit={() => setCurrentMode("edit")}
          onDelete={async () => {
            await onDelete(event);
            onClose();
          }}
        />
      ) : (
        <EventForm
          event={currentMode === "edit" ? event : undefined}
          dailyWorkHours={dailyWorkHours}
          onCancel={onClose}
          onSubmit={async (input) => {
            await onSave(input, event);
            onClose();
          }}
        />
      )}
    </Modal>
  );
}
