"use client";

import { Card } from "@/components/ui/Card";
import { formatDateRange } from "@/lib/utils/dates";
import type { FreePeriod } from "@/lib/utils/opportunities";
import { formatHours } from "@/lib/utils/projection";

export function OpportunitiesCard({ periods }: { periods: FreePeriod[] }) {
  return (
    <Card title="Oportunidades de folga">
      {periods.length === 0 ? (
        <p className="text-sm text-mute">
          Ainda não há períodos consecutivos livres à frente neste ano.
        </p>
      ) : (
        <ul className="space-y-2">
          {periods.map((period) => (
            <li
              key={`${period.kind}-${period.startDate}-${period.endDate}`}
              className="rounded-2xl bg-sand px-3 py-3"
            >
              <p className="font-medium text-ink">{period.title}</p>
              <p className="text-sm text-mute">
                {formatDateRange(period.startDate, period.endDate)} · custo{" "}
                {formatHours(-Math.abs(period.costHours))}
              </p>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
