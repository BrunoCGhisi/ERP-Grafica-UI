import { z } from "zod";

export const salesOfMonthSchema = z.object({
  dataVenda: z.string(), // Formato 'DD/MM'
  faturamento: z.number(),
});

export type SalesOfMonthSchemaType = z.infer<typeof salesOfMonthSchema>;
