import { z } from "zod";

export const insumoSchema = z.object({
    id: z.number().optional(),
    nome: z.string().min(1, "Campo obrigatório"),
    estoque: z.number().optional(),
    isActive: z.boolean().optional(),
    valorM2: z.coerce.number(),
  });
  
export interface InsumoDataRow {
    id: number;
    nome: string;
    estoque: number;
    isActive: boolean;
    valorM2: number;
  }

export type insumoSchemaType = z.infer<typeof insumoSchema>;