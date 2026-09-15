"use client";

import { Card } from "@/components/ui/Card";
import { formatDateRange } from "@/lib/utils/dates";
import type { FreePeriod } from "@/lib/utils/opportunities";
import { formatHours } from "@/lib/utils/projection";

export function OpportunitiesCard({ periods }: { periods: FreePeriod[] }) {
  return (
    <Card title="Pontes">
      {periods.length === 0 ? (
        <p className="text-sm text-mute">Nenhuma ponte à frente neste ano.</p>
      ) : (
        <div className="flex gap-3 overflow-x-auto pb-1">
          {periods.map((period) => (
            <div
              key={`${period.kind}-${period.startDate}-${period.endDate}`}
              className="min-w-52 shrink-0 rounded-2xl bg-sand px-4 py-3"
            >
              <p className="text-sm font-medium">{period.title}</p>
              <p className="mt-1 text-xs text-mute">
                {formatDateRange(period.startDate, period.endDate)} ·{" "}
                {formatHours(-Math.abs(period.costHours))}
              </p>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
