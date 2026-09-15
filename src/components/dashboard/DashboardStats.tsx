"use client";

import type { BankHoursProjection } from "@/lib/utils/projection";
import { formatHours } from "@/lib/utils/projection";

export function DashboardStats({
  projection,
  dailyWorkHours,
}: {
  projection: BankHoursProjection;
  dailyWorkHours: number;
}) {
  const items = [
    { label: "Agora", value: formatHours(projection.currentBalanceHours) },
    { label: "Projetado", value: formatHours(projection.projectedBalanceHours), featured: true },
    { label: "Folgas", value: formatHours(projection.plannedLeaveHours) },
    { label: "Créditos", value: formatHours(projection.futureCreditHours) },
  ];

  const tone =
    projection.tone === "positive"
      ? "text-terra"
      : projection.tone === "zero"
        ? "text-amber-300"
        : "text-red-400";

  return (
    <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {items.map((item) => (
        <div key={item.label} className="rounded-3xl border border-line/80 bg-surface/80 px-4 py-4">
          <p className="text-xs text-mute">{item.label}</p>
          <p
            className={`mt-2 font-mono text-2xl tracking-tight ${item.featured ? tone : "text-ink"}`}
          >
            {item.value}
          </p>
          {item.label === "Agora" ? (
            <p className="mt-2 text-xs text-mute">
              {dailyWorkHours} h/dia
              {projection.hoursStillNeeded > 0
                ? ` · faltam ${projection.hoursStillNeeded} h`
                : " · coberto"}
            </p>
          ) : null}
        </div>
      ))}
    </section>
  );
}
