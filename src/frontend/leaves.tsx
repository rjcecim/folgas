"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { usePlanner } from "@/features/planner/usePlanner";
import { DayForm } from "./day-form";
import { DayList } from "./day-list";
import { Filters } from "./filters";
import { Frame } from "./frame";

export function LeavesScreen() {
  const planner = usePlanner();
  const searchParams = useSearchParams();
  const [selectedId, setSelectedId] = useState<string | undefined>(
    () => searchParams.get("edit") ?? undefined,
  );
  const editing = planner.events.find((event) => event.id === selectedId);
  const catalog = useMemo(
    () => [...planner.filteredEvents].sort((a, b) => a.startDate.localeCompare(b.startDate)),
    [planner.filteredEvents],
  );

  return (
    <Frame>
      <main className="mx-auto max-w-7xl space-y-8 px-4 pb-16 pt-8 sm:px-6">
        <div>
          <p className="text-sm text-soft">Cadastro de dias, viagens e créditos</p>
          <h1 className="mt-1 text-4xl font-semibold tracking-tight sm:text-5xl">Folgas</h1>
        </div>

        {planner.error ? <p className="text-sm text-red-600">{planner.error}</p> : null}

        <div className="grid gap-6 xl:grid-cols-2">
          <section className="rounded-[28px] bg-white p-5 ring-1 ring-hair sm:p-6">
            <h2 className="mb-4 text-sm text-soft">{editing ? "Editar dia" : "Novo dia"}</h2>
            <DayForm
              key={editing?.id ?? "new"}
              event={editing}
              dailyWorkHours={planner.dailyWorkHours}
              parcels={planner.parcels}
              preview={planner.previewLeaveAllocation}
              onCancel={() => setSelectedId(undefined)}
              onSubmit={async (input) => {
                await planner.persistEvent(input, editing);
                setSelectedId(undefined);
              }}
            />
          </section>

          <section className="rounded-[28px] bg-white p-5 ring-1 ring-hair sm:p-6">
            <h2 className="mb-4 text-sm text-soft">Lista</h2>
            <div className="mb-4">
              <Filters value={planner.filters} years={planner.years} onChange={planner.setFilters} />
            </div>
            <DayList
              events={catalog}
              onEdit={(event) => setSelectedId(event.id)}
              onDelete={planner.deleteEvent}
            />
          </section>
        </div>
      </main>
    </Frame>
  );
}
