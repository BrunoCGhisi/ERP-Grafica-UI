import { z } from "zod";


export const bancoSchema = z.object({
    id: z.number().optional(),
    nome: z.string().min(1, "Campo obrigatório"),
    valorTotal: z.number(),
    isActive: z.boolean().optional(),
  });
  
export interface BancoDataRow {
    id: number;
    nome: string;
    valorTotal: number;
    isActive: boolean;
  }

export type bancoSchemaType = z.infer<typeof bancoSchema>;
