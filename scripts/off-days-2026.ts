export interface OffDaySeed {
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
}

function day(
  id: string,
  title: string,
  date: string,
  type: OffDaySeed["type"],
  nature: string,
): OffDaySeed {
  return {
    id,
    title,
    startDate: date,
    endDate: date,
    type,
    nature,
  };
}

export const LEGACY_EVENT_IDS = [
  "old-2026-02-16",
  "old-2026-02-17",
  "old-2026-02-18",
  "old-2026-04-02",
  "old-2026-04-03",
  "old-2026-04-20",
  "old-2026-04-21",
  "old-2026-05-01",
  "old-2026-06-04",
  "old-2026-06-05",
  "old-2026-09-07",
  "old-2026-10-12",
  "old-2026-10-26",
  "old-2026-10-27",
  "old-2026-10-28",
  "old-2026-11-02",
  "old-2026-11-20",
  "old-2026-12-07",
  "old-2026-12-08",
  "old-2026-12-20",
];

export const OFF_DAYS_2026: OffDaySeed[] = [
  day("livre-2026-02-16", "Carnaval", "2026-02-16", "optional_day", "Ponto facultativo"),
  day("livre-2026-02-17", "Carnaval", "2026-02-17", "optional_day", "Ponto facultativo"),
  day("livre-2026-02-18", "Quarta-feira de Cinzas", "2026-02-18", "optional_day", "Ponto facultativo"),
  day("livre-2026-04-02", "Quinta-feira Santa", "2026-04-02", "optional_day", "Ponto facultativo"),
  day("livre-2026-04-03", "Sexta-feira da Paixão", "2026-04-03", "national_holiday", "Feriado"),
  day("livre-2026-04-20", "Sem expediente", "2026-04-20", "work_suspension", "Sem expediente"),
  day("livre-2026-04-21", "Tiradentes", "2026-04-21", "national_holiday", "Feriado"),
  day("livre-2026-05-01", "Dia do Trabalho", "2026-05-01", "national_holiday", "Feriado"),
  day("livre-2026-06-04", "Corpus Christi", "2026-06-04", "optional_day", "Ponto facultativo"),
  day("livre-2026-06-05", "Sem expediente", "2026-06-05", "work_suspension", "Sem expediente"),
  day("livre-2026-09-07", "Independência do Brasil", "2026-09-07", "national_holiday", "Feriado"),
  day("livre-2026-10-12", "Nossa Senhora Aparecida / Pós Círio", "2026-10-12", "national_holiday", "Feriado"),
  day("livre-2026-10-26", "Recírio", "2026-10-26", "optional_day", "Ponto facultativo"),
  day("livre-2026-10-27", "Sem expediente", "2026-10-27", "work_suspension", "Sem expediente"),
  day("livre-2026-10-28", "Dia do Servidor Público", "2026-10-28", "optional_day", "Ponto facultativo"),
  day("livre-2026-11-02", "Finados", "2026-11-02", "national_holiday", "Feriado"),
  day("livre-2026-11-20", "Dia Nacional de Zumbi e da Consciência Negra", "2026-11-20", "national_holiday", "Feriado"),
  day("livre-2026-12-07", "Sem expediente", "2026-12-07", "work_suspension", "Sem expediente"),
  day("livre-2026-12-08", "Nossa Senhora da Conceição", "2026-12-08", "municipal_holiday", "Feriado"),
  {
    id: "livre-2026-12-20",
    title: "Recesso",
    startDate: "2026-12-20",
    endDate: "2026-12-31",
    type: "recess",
    nature: "Recesso",
  },
];
