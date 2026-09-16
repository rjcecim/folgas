"use client";

import { useState } from "react";
import { dailyWorkHoursSchema } from "@/lib/validation/bankParcel";
import { Btn, Field, Input } from "./ui";

export function BankForm({
  dailyWorkHours,
  onSave,
}: {
  dailyWorkHours: number;
  onSave: (dailyWorkHours: number) => Promise<void>;
}) {
  const [hours, setHours] = useState(dailyWorkHours);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  return (
    <form
      className="grid gap-3 sm:grid-cols-[1fr_auto] sm:items-end"
      onSubmit={async (event) => {
        event.preventDefault();
        const parsed = dailyWorkHoursSchema.safeParse({ dailyWorkHours: hours });
        if (!parsed.success) {
          setError(parsed.error.issues[0]?.message ?? "Dados inválidos.");
          return;
        }
        setError(null);
        setSaving(true);
        try {
          await onSave(parsed.data.dailyWorkHours);
        } finally {
          setSaving(false);
        }
      }}
    >
      <Field label="Jornada diária (horas)" error={error ?? undefined}>
        <Input
          type="number"
          step="0.5"
          value={hours}
          onChange={(event) => setHours(Number(event.target.value))}
        />
      </Field>
      <Btn type="submit" disabled={saving}>
        {saving ? "Salvando..." : "Atualizar jornada"}
      </Btn>
    </form>
  );
}
