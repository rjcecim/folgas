"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { AppHeader } from "@/components/layout/AppHeader";
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
    () =>
      [...planner.filteredEvents].sort((a, b) => a.startDate.localeCompare(b.startDate)),
    [planner.filteredEvents],
  );

  return (
    <div className="min-h-screen">
      <AppHeader />
      <main className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-terra">Fora do painel</p>
          <h1 className="mt-1 font-serif text-4xl text-ink">Cadastro</h1>
          <p className="mt-2 max-w-2xl text-mute">
            Aqui você informa jornada, saldo, dias sem expediente, folgas, créditos e viagens.
            O painel só mostra o resumo e o calendário.
          </p>
        </div>

        {planner.error ? <p className="text-sm text-rose-700">{planner.error}</p> : null}

        <Card title="Banco de horas">
          {planner.settings ? (
            <BankHoursForm
              key={`${planner.settings.currentBalanceHours}-${planner.settings.dailyWorkHours}`}
              settings={planner.settings}
              onSave={planner.persistBankHours}
            />
          ) : (
            <p className="text-sm text-mute">Carregando saldo...</p>
          )}
        </Card>

        <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
          <Card title={editing ? "Editar evento" : "Novo evento"}>
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

          <Card title="Dias cadastrados">
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
    </div>
  );
}
