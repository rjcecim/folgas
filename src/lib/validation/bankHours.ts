import { z } from "zod";

export const bankHoursSchema = z.object({
  currentBalanceHours: z
    .number({ error: "Informe o saldo atual." })
    .min(-999, "Saldo fora do intervalo."),
  dailyWorkHours: z
    .number({ error: "Informe a jornada diária." })
    .positive("A jornada diária deve ser maior que zero.")
    .max(24, "A jornada diária não pode passar de 24 horas."),
});

export type BankHoursFormValues = z.infer<typeof bankHoursSchema>;
