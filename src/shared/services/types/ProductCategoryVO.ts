import { z } from "zod";

export const proCategorySchema = z.object({
  id: z.number().optional(),
  categoria: z.string(),
});

export interface ProductCategoryDataRow {
  id: number;
  categoria: string;
}

export type proCategorySchemaType = z.infer<typeof proCategorySchema>;
