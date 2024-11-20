import { z } from "zod";

export const proCategorySchema = z.object({
  id: z.number().optional(),
  categoria: z.string().min(1, "Campo obrigatório"),
});

export interface ProductCategoryDataRow {
  id: number;
  categoria: string;
}

export type proCategorySchemaType = z.infer<typeof proCategorySchema>;
