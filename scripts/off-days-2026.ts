export interface OfficialEventSeed {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  type:
    | "national_holiday"
    | "municipal_holiday"
    | "optional_day"
    | "work_suspension"
    | "recess";
  nature: string;
  legalBasis: string;
  notes: string;
}

const ART1 =
  "Portaria nº 45.223, de 09 de janeiro de 2026, art. 1º";
const ART2 =
  "Portaria nº 45.223, de 09 de janeiro de 2026, art. 2º";
const ART2_NOTES =
  "A compensação da ausência será definida em ato próprio, conforme parágrafo único do art. 2º da Portaria nº 45.223/2026.";

function day(
  id: string,
  title: string,
  date: string,
  type: OfficialEventSeed["type"],
  nature: string,
  legalBasis: string,
  notes = "",
): OfficialEventSeed {
  return {
    id,
    title,
    startDate: date,
    endDate: date,
    type,
    nature,
    legalBasis,
    notes,
  };
}

export const OFF_DAYS_2026: OfficialEventSeed[] = [
  day("old-2026-02-16", "Carnaval", "2026-02-16", "optional_day", "Ponto Facultativo", ART1),
  day("old-2026-02-17", "Carnaval", "2026-02-17", "optional_day", "Ponto Facultativo", ART1),
  day("old-2026-02-18", "Quarta-feira de Cinzas", "2026-02-18", "optional_day", "Ponto Facultativo", ART1),
  day("old-2026-04-02", "Quinta-feira Santa", "2026-04-02", "optional_day", "Ponto Facultativo", ART1),
  day("old-2026-04-03", "Sexta-feira da Paixão", "2026-04-03", "national_holiday", "Feriado Nacional", ART1),
  day("old-2026-04-20", "Suspensão do expediente", "2026-04-20", "work_suspension", "Suspensão do expediente", ART2, ART2_NOTES),
  day("old-2026-04-21", "Tiradentes", "2026-04-21", "national_holiday", "Feriado Nacional", ART1),
  day("old-2026-05-01", "Dia do Trabalho", "2026-05-01", "national_holiday", "Feriado Nacional", ART1),
  day("old-2026-06-04", "Corpus Christi", "2026-06-04", "optional_day", "Ponto Facultativo", ART1),
  day("old-2026-06-05", "Suspensão do expediente", "2026-06-05", "work_suspension", "Suspensão do expediente", ART2, ART2_NOTES),
  day("old-2026-09-07", "Independência do Brasil", "2026-09-07", "national_holiday", "Feriado Nacional", ART1),
  day("old-2026-10-12", "Nossa Senhora Aparecida / Pós Círio", "2026-10-12", "national_holiday", "Feriado Nacional", ART1),
  day("old-2026-10-26", "Recírio", "2026-10-26", "optional_day", "Ponto Facultativo", ART1),
  day("old-2026-10-27", "Suspensão do expediente", "2026-10-27", "work_suspension", "Suspensão do expediente", ART2, ART2_NOTES),
  day("old-2026-10-28", "Dia do Servidor Público", "2026-10-28", "optional_day", "Ponto Facultativo", ART1),
  day("old-2026-11-02", "Finados", "2026-11-02", "national_holiday", "Feriado Nacional", ART1),
  day("old-2026-11-20", "Dia Nacional de Zumbi e da Consciência Negra", "2026-11-20", "national_holiday", "Feriado Nacional", ART1),
  day("old-2026-12-07", "Suspensão do expediente", "2026-12-07", "work_suspension", "Suspensão do expediente", ART2, ART2_NOTES),
  day("old-2026-12-08", "Nossa Senhora da Conceição", "2026-12-08", "municipal_holiday", "Feriado Municipal", ART1),
  {
    id: "old-2026-12-20",
    title: "Recesso Regimental",
    startDate: "2026-12-20",
    endDate: "2026-12-31",
    type: "recess",
    nature: "Ponto Facultativo",
    legalBasis: ART1,
    notes: "",
  },
];
