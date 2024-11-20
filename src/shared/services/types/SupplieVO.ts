import { z } from "zod";

export const insumoSchema = z.object({
    id: z.number().optional(),
    nome: z.string().min(1, "Campo obrigatório"),
    estoque: z.number(),
    isActive: z.boolean(),
  });
  
export interface InsumoDataRow {
    id: number;
    nome: string;
    estoque: number;
    isActive: boolean;
  }

export type insumoSchemaType = z.infer<typeof insumoSchema>;