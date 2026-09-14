"use client";

import { useState } from "react";
import type { BankHoursSettings } from "@/types";
import { Button } from "@/components/ui/Button";
import { Field, Input } from "@/components/ui/Field";
import { bankHoursSchema } from "@/lib/validation/bankHours";

export function BankHoursForm({
  settings,
  onSave,
}: {
  settings: BankHoursSettings;
  onSave: (values: { currentBalanceHours: number; dailyWorkHours: number }) => Promise<void>;
}) {
  const [currentBalanceHours, setCurrentBalanceHours] = useState(settings.currentBalanceHours);
  const [dailyWorkHours, setDailyWorkHours] = useState(settings.dailyWorkHours);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  return (
    <form
      className="grid gap-3 sm:grid-cols-[1fr_1fr_auto] sm:items-end"
      onSubmit={async (event) => {
        event.preventDefault();
        const parsed = bankHoursSchema.safeParse({
          currentBalanceHours,
          dailyWorkHours,
        });
        if (!parsed.success) {
          setError(parsed.error.issues[0]?.message ?? "Dados inválidos.");
          return;
        }
        setError(null);
        setSaving(true);
        try {
          await onSave(parsed.data);
        } finally {
          setSaving(false);
        }
      }}
    >
      <Field label="Saldo atual (horas)" error={error && error.includes("saldo") ? error : undefined}>
        <Input
          type="number"
          step="0.5"
          value={currentBalanceHours}
          onChange={(event) => setCurrentBalanceHours(Number(event.target.value))}
        />
      </Field>
      <Field label="Jornada diária">
        <Input
          type="number"
          step="0.5"
          value={dailyWorkHours}
          onChange={(event) => setDailyWorkHours(Number(event.target.value))}
        />
      </Field>
      <Button type="submit" disabled={saving}>
        {saving ? "Salvando..." : "Atualizar saldo"}
      </Button>
      {error && !error.includes("saldo") ? (
        <p className="text-sm text-rose-700 sm:col-span-3">{error}</p>
      ) : null}
    </form>
  );
}
