import { z } from "zod";
import { EVENT_STATUSES, EVENT_TYPES } from "@/types";

export const eventFormSchema = z
  .object({
    title: z.string().trim().min(1, "Informe o título."),
    startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Data inicial inválida."),
    endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Data final inválida."),
    type: z.enum(EVENT_TYPES),
    nature: z.string().trim().min(1, "Informe a natureza."),
    official: z.boolean(),
    status: z.enum(EVENT_STATUSES),
    hours: z.number().min(0, "As horas não podem ser negativas."),
    includeInProjection: z.boolean(),
    legalBasis: z.string(),
    notes: z.string(),
  })
  .refine((value) => value.endDate >= value.startDate, {
    message: "A data final deve ser igual ou posterior à inicial.",
    path: ["endDate"],
  })
  .refine(
    (value) =>
      value.type !== "bank_hours_leave" && value.type !== "future_bank_credit"
        ? true
        : value.hours > 0,
    {
      message: "Informe as horas do banco.",
      path: ["hours"],
    },
  );

export type EventFormValues = z.infer<typeof eventFormSchema>;
