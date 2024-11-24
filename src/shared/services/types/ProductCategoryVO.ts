import { z } from "zod";

export const proCategorySchema = z.object({
  id: z.number().optional(),
  categoria: z.string().min(1, "Campo obrigatório"),
  isActive: z.boolean().optional()
});

export interface ProductCategoryDataRow {
  id: number;
  categoria: string;
  isActive: boolean;
}

export type proCategorySchemaType = z.infer<typeof proCategorySchema>;
