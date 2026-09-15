"use client";

import type { BankHoursProjection } from "@/lib/utils/projection";
import { formatHours } from "@/lib/utils/projection";

const tones = {
  positive: "from-emerald-700 to-emerald-900",
  zero: "from-amber-600 to-amber-800",
  negative: "from-rose-700 to-rose-900",
};

export function DashboardStats({
  projection,
  dailyWorkHours,
}: {
  projection: BankHoursProjection;
  dailyWorkHours: number;
}) {
  const items = [
    { label: "Saldo atual", value: formatHours(projection.currentBalanceHours) },
    { label: "Saldo projetado", value: formatHours(projection.projectedBalanceHours) },
    { label: "Folgas planejadas", value: formatHours(projection.plannedLeaveHours) },
    { label: "Créditos futuros", value: formatHours(projection.futureCreditHours) },
  ];

  return (
    <section className={`overflow-hidden rounded-3xl bg-linear-to-br ${tones[projection.tone]} p-6 text-white`}>
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-white/70">Banco de horas</p>
          <p className="mt-1 text-sm text-white/85">
            Jornada de {dailyWorkHours} h
            {projection.hoursStillNeeded > 0
              ? ` · ainda faltam ${projection.hoursStillNeeded} h`
              : " · planejamento coberto"}
          </p>
        </div>
        <span className="rounded-full bg-white/15 px-3 py-1 text-xs">
          {projection.tone === "positive"
            ? "Saldo positivo"
            : projection.tone === "zero"
              ? "Saldo zerado"
              : "Saldo negativo"}
        </span>
      </div>
      <dl className="grid gap-4 sm:grid-cols-4">
        {items.map((item) => (
          <div key={item.label}>
            <dt className="text-[11px] uppercase tracking-[0.16em] text-white/65">{item.label}</dt>
            <dd className="mt-1 font-serif text-3xl">{item.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
