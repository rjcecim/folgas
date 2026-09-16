"use client";

import { usePlanner } from "@/features/planner/usePlanner";
import { BankForm } from "./bank-form";
import { BankLedger } from "./bank-ledger";
import { Frame } from "./frame";

export function BankScreen() {
  const planner = usePlanner();

  return (
    <Frame>
      <main className="mx-auto max-w-7xl space-y-8 px-4 pb-16 pt-8 sm:px-6">
        <div>
          <p className="text-sm text-soft">Extrato, parcelas e vencimento</p>
          <h1 className="mt-1 text-4xl font-semibold tracking-tight sm:text-5xl">Banco</h1>
        </div>

        {planner.error ? <p className="text-sm text-red-600">{planner.error}</p> : null}

        <section className="rounded-[28px] bg-white p-5 ring-1 ring-hair sm:p-6">
          {planner.settings ? (
            <div className="space-y-6">
              <BankForm
                key={planner.settings.dailyWorkHours}
                dailyWorkHours={planner.dailyWorkHours}
                onSave={planner.persistDailyWorkHours}
              />
              <BankLedger
                today={planner.today}
                parcels={planner.parcels}
                adjustments={planner.adjustments}
                summary={planner.summary}
                onSaveParcel={planner.persistParcel}
                onDistributeLegacy={planner.distributeLegacy}
              />
            </div>
          ) : (
            <p className="text-sm text-soft">Carregando...</p>
          )}
        </section>
      </main>
    </Frame>
  );
}
