"use client";

import { useMemo, useState } from "react";
import type { BankAdjustment, BankParcel, BankParcelInput, BankSummary } from "@/types";
import { MONTH_LABELS } from "@/lib/constants";
import {
  expiresOnFromOriginMonth,
  parcelIdFor,
  parcelLabel,
  validityLabel,
} from "@/lib/utils/bankLedger";
import { formatDuration, hoursMinutesToMinutes, minutesToHoursMinutes } from "@/lib/utils/duration";
import { bankParcelSchema, distributeLegacySchema } from "@/lib/validation/bankParcel";
import { Btn, Field, Input, Select, Textarea } from "./ui";

const EXTRACT_URL =
  "https://projetos.tce.pa/portalsistemas/Aplicacao/Paginas/FrequenciaExtratoBancoDeHoras.aspx";

const EXAMPLE = [
  { month: "Maio/2026", minutes: 0, expires: "30/09/2026" },
  { month: "Junho/2026", minutes: 321, expires: "30/10/2026" },
  { month: "Julho/2026", minutes: 155, expires: "30/11/2026" },
  { month: "Agosto/2026", minutes: 957, expires: "31/12/2026" },
  { month: "Setembro/2026", minutes: 106, expires: "30/01/2027", open: true },
];

export function BankLedger({
  today,
  parcels,
  adjustments,
  summary,
  onSaveParcel,
  onDistributeLegacy,
}: {
  today: string;
  parcels: BankParcel[];
  adjustments: BankAdjustment[];
  summary: BankSummary;
  onSaveParcel: (input: BankParcelInput, extractAlreadyIncludesUses: boolean) => Promise<void>;
  onDistributeLegacy: (year: number, month: number, minutes: number) => Promise<void>;
}) {
  const now = new Date();
  const [originYear, setOriginYear] = useState(now.getFullYear());
  const [originMonth, setOriginMonth] = useState(now.getMonth() + 1);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [expiresOn, setExpiresOn] = useState(() =>
    expiresOnFromOriginMonth(now.getFullYear(), now.getMonth() + 1),
  );
  const [reviewedOn, setReviewedOn] = useState(today);
  const [monthState, setMonthState] = useState<"open" | "closed">("open");
  const [notes, setNotes] = useState("");
  const [extractAlreadyIncludesUses, setExtractAlreadyIncludesUses] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [legacyHours, setLegacyHours] = useState(0);
  const [legacyMinutes, setLegacyMinutes] = useState(0);
  const [legacyTargetMonth, setLegacyTargetMonth] = useState(originMonth);
  const [legacyTargetYear, setLegacyTargetYear] = useState(originYear);

  const selected = useMemo(
    () => parcels.find((parcel) => parcel.id === parcelIdFor(originYear, originMonth)),
    [originMonth, originYear, parcels],
  );
  const legacy = parcels.find((parcel) => parcel.kind === "legacy");
  const ordered = useMemo(
    () =>
      [...parcels].sort((a, b) => {
        if (a.kind !== b.kind) return a.kind === "legacy" ? -1 : 1;
        return parcelLabel(b).localeCompare(parcelLabel(a));
      }),
    [parcels],
  );

  function loadParcel(parcel: BankParcel) {
    if (parcel.originYear) setOriginYear(parcel.originYear);
    if (parcel.originMonth) setOriginMonth(parcel.originMonth);
    const parts = minutesToHoursMinutes(parcel.extractMinutes);
    setHours(Math.abs(parts.hours));
    setMinutes(parts.minutes);
    setExpiresOn(
      parcel.expiresOn ??
        (parcel.originYear != null && parcel.originMonth != null
          ? expiresOnFromOriginMonth(parcel.originYear, parcel.originMonth)
          : ""),
    );
    setReviewedOn(parcel.reviewedOn || today);
    setMonthState(parcel.monthState);
    setNotes(parcel.notes);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-well px-4 py-3 text-sm ring-1 ring-hair">
        <p>
          Abra o{" "}
          <a className="text-accent underline" href={EXTRACT_URL} target="_blank" rel="noreferrer">
            Portal de Sistemas do TCE
          </a>{" "}
          → Frequência e banco de horas → Extrato. Selecione o exercício e o mês atual. Copie os
          valores do resumo mensal abaixo dos registros diários. Os valores do portal estão em
          minutos. Atualize a parcela do mês correspondente, sem duplicar o lançamento.
        </p>
        <p className="mt-2 text-soft">
          O prazo oficial é de 4 meses a contar do último dia do mês em que as horas foram feitas
          (art. 4º da Portaria 30.795/2016). Horas de junho/2026 vencem em 30/10/2026; as de
          setembro/2026, em 30/01/2027. O vencimento é preenchido automaticamente. O mês em
          andamento ainda pode mudar no extrato. A ordem de uso (o que vence primeiro) é só
          controle pessoal.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <Stat label="Registrado" value={summary.registeredMinutes} />
        <Stat label="Validade confirmada" value={summary.confirmedMinutes} />
        <Stat label="Perto do vencimento" value={summary.nearExpiryMinutes} hint="aviso pessoal, 30 dias" />
        <Stat label="Vencidas" value={summary.expiredMinutes} />
        <Stat label="Validade pendente" value={summary.pendingMinutes} hint="saldo sem mês de origem" />
      </div>

      <details className="rounded-2xl bg-well px-4 py-3 text-sm ring-1 ring-hair">
        <summary className="cursor-pointer font-medium">Exemplo de 15/09/2026, só para conferir a tela</summary>
        <ul className="mt-3 space-y-1 text-soft">
          {EXAMPLE.map((row) => (
            <li key={row.month}>
              {row.month}: {row.minutes} min = {formatDuration(row.minutes)}, vence {row.expires}
              {row.open ? ", em andamento" : ""}
            </li>
          ))}
          <li>Total: 1.539 min = {formatDuration(1539)}</li>
        </ul>
        <p className="mt-2 text-soft">
          Esse exemplo não grava no cadastro. Os vencimentos acima são só a regra do art. 4º, não
          vêm do extrato.
        </p>
      </details>

      <form
        className="grid gap-4 md:grid-cols-2"
        onSubmit={async (event) => {
          event.preventDefault();
          const parsed = bankParcelSchema.safeParse({
            originYear,
            originMonth,
            hours,
            minutes,
            expiresOn,
            reviewedOn,
            monthState,
            notes,
            extractAlreadyIncludesUses,
          });
          if (!parsed.success) {
            setError(parsed.error.issues[0]?.message ?? "Dados inválidos.");
            return;
          }
          setError(null);
          setSaving(true);
          try {
            await onSaveParcel(
              {
                originYear: parsed.data.originYear,
                originMonth: parsed.data.originMonth,
                extractMinutes: hoursMinutesToMinutes(parsed.data.hours, parsed.data.minutes),
                expiresOn: parsed.data.expiresOn || null,
                reviewedOn: parsed.data.reviewedOn,
                monthState: parsed.data.monthState,
                notes: parsed.data.notes,
              },
              parsed.data.extractAlreadyIncludesUses,
            );
          } finally {
            setSaving(false);
          }
        }}
      >
        <Field label="Mês de origem">
          <Select
            value={originMonth}
            onChange={(event) => {
              const month = Number(event.target.value);
              setOriginMonth(month);
              setExpiresOn(expiresOnFromOriginMonth(originYear, month));
            }}
          >
            {MONTH_LABELS.map((label, index) => (
              <option key={label} value={index + 1}>
                {label}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Ano de origem">
          <Input
            type="number"
            value={originYear}
            onChange={(event) => {
              const year = Number(event.target.value);
              setOriginYear(year);
              setExpiresOn(expiresOnFromOriginMonth(year, originMonth));
            }}
          />
        </Field>
        <Field label="Horas do extrato">
          <Input type="number" min={0} step={1} value={hours} onChange={(event) => setHours(Number(event.target.value))} />
        </Field>
        <Field label="Minutos do extrato">
          <Input
            type="number"
            min={0}
            max={59}
            step={1}
            value={minutes}
            onChange={(event) => setMinutes(Number(event.target.value))}
          />
        </Field>
        <Field label="Vencimento">
          <Input type="date" value={expiresOn} onChange={(event) => setExpiresOn(event.target.value)} />
        </Field>
        <Field label="Conferido no portal em">
          <Input type="date" value={reviewedOn} onChange={(event) => setReviewedOn(event.target.value)} />
        </Field>
        <Field label="Situação do mês">
          <Select
            value={monthState}
            onChange={(event) => setMonthState(event.target.value as "open" | "closed")}
          >
            <option value="open">Em andamento</option>
            <option value="closed">Fechado</option>
          </Select>
        </Field>
        <Field label="Observação">
          <Textarea value={notes} onChange={(event) => setNotes(event.target.value)} />
        </Field>
        <label className="flex items-center gap-2 text-sm md:col-span-2">
          <input
            type="checkbox"
            checked={extractAlreadyIncludesUses}
            onChange={(event) => setExtractAlreadyIncludesUses(event.target.checked)}
          />
          O extrato já descontou folgas confirmadas desse mês. Não reserve essas horas de novo.
        </label>
        {selected ? (
          <p className="text-sm text-soft md:col-span-2">
            Este mês já existe com {formatDuration(selected.extractMinutes)}. Salvar substitui o
            saldo conferido; não soma de novo.
          </p>
        ) : null}
        {error ? <p className="text-sm text-red-600 md:col-span-2">{error}</p> : null}
        <div className="md:col-span-2">
          <Btn type="submit" disabled={saving}>
            {saving ? "Salvando..." : selected ? "Substituir saldo do mês" : "Cadastrar parcela"}
          </Btn>
        </div>
      </form>

      <div className="space-y-2">
        {ordered.length === 0 ? (
          <p className="text-sm text-soft">Nenhuma parcela cadastrada.</p>
        ) : (
          ordered.map((parcel) => (
            <button
              key={parcel.id}
              type="button"
              onClick={() => loadParcel(parcel)}
              className="flex w-full flex-wrap items-center justify-between gap-2 rounded-2xl px-3 py-3 text-left ring-1 ring-hair hover:bg-well"
            >
              <span>
                <span className="font-medium">{parcelLabel(parcel)}</span>
                <span className="ml-2 text-sm text-soft">
                  {parcel.monthState === "open" ? "em andamento" : "fechado"} ·{" "}
                  {validityLabel(parcel, today)}
                </span>
              </span>
              <strong>{formatDuration(parcel.extractMinutes)}</strong>
            </button>
          ))
        )}
      </div>

      {legacy && legacy.extractMinutes > 0 ? (
        <form
          className="grid gap-3 rounded-2xl bg-well p-4 ring-1 ring-hair sm:grid-cols-4 sm:items-end"
          onSubmit={async (event) => {
            event.preventDefault();
            const parsed = distributeLegacySchema.safeParse({
              targetYear: legacyTargetYear,
              targetMonth: legacyTargetMonth,
              hours: legacyHours,
              minutes: legacyMinutes,
            });
            if (!parsed.success) return;
            await onDistributeLegacy(
              parsed.data.targetYear,
              parsed.data.targetMonth,
              hoursMinutesToMinutes(parsed.data.hours, parsed.data.minutes),
            );
          }}
        >
          <p className="text-sm sm:col-span-4">
            Saldo legado {formatDuration(legacy.extractMinutes)}, validade pendente. Distribua para
            um mês sem duplicar o total.
          </p>
          <Field label="Para o mês">
            <Select
              value={legacyTargetMonth}
              onChange={(event) => setLegacyTargetMonth(Number(event.target.value))}
            >
              {MONTH_LABELS.map((label, index) => (
                <option key={label} value={index + 1}>
                  {label}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Ano">
            <Input
              type="number"
              value={legacyTargetYear}
              onChange={(event) => setLegacyTargetYear(Number(event.target.value))}
            />
          </Field>
          <Field label="Horas">
            <Input
              type="number"
              min={0}
              value={legacyHours}
              onChange={(event) => setLegacyHours(Number(event.target.value))}
            />
          </Field>
          <Field label="Minutos">
            <Input
              type="number"
              min={0}
              max={59}
              value={legacyMinutes}
              onChange={(event) => setLegacyMinutes(Number(event.target.value))}
            />
          </Field>
          <Btn type="submit" className="sm:col-span-4">
            Distribuir legado
          </Btn>
        </form>
      ) : null}

      {adjustments.length > 0 ? (
        <div>
          <h3 className="mb-2 text-sm text-soft">Histórico de ajustes</h3>
          <ul className="space-y-1 text-sm">
            {adjustments.slice(0, 12).map((item) => (
              <li key={item.id} className="rounded-xl px-3 py-2 ring-1 ring-hair">
                {item.createdAt.slice(0, 10)} · {item.reason} ·{" "}
                {formatDuration(item.previousMinutes)} → {formatDuration(item.nextMinutes)}
                {item.note ? ` · ${item.note}` : ""}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}

function Stat({ label, value, hint }: { label: string; value: number; hint?: string }) {
  return (
    <div className="rounded-2xl bg-well px-3 py-3 ring-1 ring-hair">
      <p className="text-xs text-soft">{label}</p>
      <p className="mt-1 text-lg font-semibold">{formatDuration(value)}</p>
      {hint ? <p className="mt-1 text-[11px] text-soft">{hint}</p> : null}
    </div>
  );
}
