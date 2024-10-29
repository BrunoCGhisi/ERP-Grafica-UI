import { z } from "zod";

export const formaPgtoSchema = z.object({
  id: z.number().optional(),
  tipo: z.string(),
  idBanco: z.number().optional(),
});

export interface FormaPgtoDataRow {
  id: number;
  tipo: string;
  idBanco: number;
}

export type formaPgtoSchemaType = z.infer<typeof formaPgtoSchema>;
