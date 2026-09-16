import { z } from "zod";
import { PARCEL_MONTH_STATES } from "@/types/bank";

export const bankParcelSchema = z.object({
  originYear: z
    .number({ error: "Informe o ano de origem." })
    .int()
    .min(2000, "Ano inválido.")
    .max(2100, "Ano inválido."),
  originMonth: z
    .number({ error: "Informe o mês de origem." })
    .int()
    .min(1, "Mês inválido.")
    .max(12, "Mês inválido."),
  hours: z.number({ error: "Informe as horas." }).int().min(0, "Horas não podem ser negativas."),
  minutes: z
    .number({ error: "Informe os minutos." })
    .int()
    .min(0, "Minutos inválidos.")
    .max(59, "Minutos devem ficar entre 0 e 59."),
  expiresOn: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Data de vencimento inválida.")
    .optional()
    .or(z.literal("")),
  reviewedOn: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Data da conferência inválida."),
  monthState: z.enum(PARCEL_MONTH_STATES),
  notes: z.string(),
  extractAlreadyIncludesUses: z.boolean(),
});

export const dailyWorkHoursSchema = z.object({
  dailyWorkHours: z
    .number({ error: "Informe a jornada diária." })
    .positive("A jornada diária deve ser maior que zero.")
    .max(24, "A jornada diária não pode passar de 24 horas."),
});

export const distributeLegacySchema = z.object({
  targetYear: z.number().int().min(2000).max(2100),
  targetMonth: z.number().int().min(1).max(12),
  hours: z.number().int().min(0),
  minutes: z.number().int().min(0).max(59),
});
