import { z } from "zod";


export const bancoSchema = z.object({
    id: z.number().optional(),
    nome: z.string().min(1, "Campo obrigatório"),
    valorTotal: z.number(),
  });
  
export interface BancoDataRow {
    id: number;
    nome: string;
    valorTotal: number;
  }

export type bancoSchemaType = z.infer<typeof bancoSchema>;
