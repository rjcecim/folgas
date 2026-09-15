"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { AppShell } from "@/components/layout/AppShell";
import { BankHoursForm } from "@/features/bank-hours/BankHoursForm";
import { EventCatalog } from "@/features/events/EventCatalog";
import { EventFilters } from "@/features/events/EventFilters";
import { EventForm } from "@/features/events/EventForm";
import { usePlanner } from "@/features/planner/usePlanner";

export function CadastroPage() {
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
    <AppShell projection={planner.projection} dailyWorkHours={planner.dailyWorkHours}>
      <main className="mx-auto w-full max-w-6xl space-y-6 px-4 py-6 sm:px-6 lg:py-8">
        <div>
          <p className="text-sm text-mute">Gerenciar</p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight sm:text-4xl">Dias e saldo</h1>
        </div>

        {planner.error ? <p className="text-sm text-red-400">{planner.error}</p> : null}

        <Card title="Banco de horas">
          {planner.settings ? (
            <BankHoursForm
              key={`${planner.settings.currentBalanceHours}-${planner.settings.dailyWorkHours}`}
              settings={planner.settings}
              onSave={planner.persistBankHours}
            />
          ) : (
            <p className="text-sm text-mute">Carregando...</p>
          )}
        </Card>

        <div className="grid gap-5 xl:grid-cols-2">
          <Card title={editing ? "Editar dia" : "Novo dia"}>
            <EventForm
              key={editing?.id ?? "new"}
              event={editing}
              dailyWorkHours={planner.dailyWorkHours}
              onCancel={() => setSelectedId(undefined)}
              onSubmit={async (input) => {
                await planner.persistEvent(input, editing);
                setSelectedId(undefined);
              }}
            />
          </Card>

          <Card title="Lista">
            <div className="mb-4">
              <EventFilters
                value={planner.filters}
                years={planner.years}
                onChange={planner.setFilters}
              />
            </div>
            <EventCatalog
              events={catalog}
              onEdit={(event) => setSelectedId(event.id)}
              onDelete={planner.deleteEvent}
            />
          </Card>
        </div>
      </main>
    </AppShell>
  );
}
