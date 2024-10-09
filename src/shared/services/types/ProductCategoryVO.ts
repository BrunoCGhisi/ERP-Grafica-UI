import { z } from "zod";

export const productCategorySchema = z.object({
  id: z.number().optional(),
  categoria: z.string(),
});

export interface ProductCategoryDataRow {
  id: number;
  categoria: string;
}

export type productCategorySchemaType = z.infer<typeof productCategorySchema>;
