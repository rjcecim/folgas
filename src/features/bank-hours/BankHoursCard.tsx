"use client";

import { Card } from "@/components/ui/Card";
import type { BankHoursProjection } from "@/lib/utils/projection";
import { formatHours } from "@/lib/utils/projection";

const toneStyles = {
  positive: "bg-terra/10 text-terra",
  zero: "bg-amber-400/10 text-amber-200",
  negative: "bg-red-400/10 text-red-300",
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
      <dl className="grid gap-4 sm:grid-cols-2">
        <div>
          <dt className="text-xs text-mute">Saldo atual</dt>
          <dd className="mt-1 font-mono text-3xl tracking-tight">
            {formatHours(projection.currentBalanceHours)}
          </dd>
        </div>
        <div>
          <dt className="text-xs text-mute">Saldo projetado</dt>
          <dd className="mt-1 font-mono text-3xl tracking-tight">
            {formatHours(projection.projectedBalanceHours)}
          </dd>
        </div>
        <div>
          <dt className="text-xs text-mute">Folgas planejadas</dt>
          <dd className="mt-1">{formatHours(projection.plannedLeaveHours)}</dd>
        </div>
        <div>
          <dt className="text-xs text-mute">Créditos futuros</dt>
          <dd className="mt-1">{formatHours(projection.futureCreditHours)}</dd>
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
