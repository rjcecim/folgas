"use client";

import { Card } from "@/components/ui/Card";
import type { BankHoursProjection } from "@/lib/utils/projection";
import { formatHours } from "@/lib/utils/projection";

const toneStyles = {
  positive: "bg-emerald-50 text-emerald-800",
  zero: "bg-amber-50 text-amber-800",
  negative: "bg-rose-50 text-rose-800",
};

const toneLabels = {
  positive: "Saldo positivo",
  zero: "Saldo zerado",
  negative: "Saldo negativo",
};

export function BankHoursCard({
  projection,
  dailyWorkHours,
}: {
  projection: BankHoursProjection;
  dailyWorkHours: number;
}) {
  return (
    <Card title="Banco de horas">
      <div className={`mb-4 rounded-2xl px-4 py-3 text-sm font-medium ${toneStyles[projection.tone]}`}>
        {toneLabels[projection.tone]}
      </div>
      <dl className="grid gap-3 sm:grid-cols-2">
        <div>
          <dt className="text-xs uppercase tracking-[0.16em] text-mute">Saldo atual</dt>
          <dd className="mt-1 font-serif text-3xl text-ink">
            {formatHours(projection.currentBalanceHours)}
          </dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-[0.16em] text-mute">Saldo projetado</dt>
          <dd className="mt-1 font-serif text-3xl text-ink">
            {formatHours(projection.projectedBalanceHours)}
          </dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-[0.16em] text-mute">Folgas planejadas</dt>
          <dd className="mt-1 text-ink">{formatHours(projection.plannedLeaveHours)}</dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-[0.16em] text-mute">Créditos futuros</dt>
          <dd className="mt-1 text-ink">{formatHours(projection.futureCreditHours)}</dd>
        </div>
      </dl>
      <p className="mt-4 text-sm text-mute">
        Jornada diária: {dailyWorkHours} h.
        {projection.hoursStillNeeded > 0
          ? ` Você ainda precisa gerar ${projection.hoursStillNeeded} horas.`
          : " Não há horas a gerar para cobrir o planejamento."}
      </p>
    </Card>
  );
}
