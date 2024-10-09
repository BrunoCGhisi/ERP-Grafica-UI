import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";


export const bancoSchema = z.object({
    id: z.number().optional(),
    nome: z.string(),
    valorTotal: z.number(),
  });
  
export interface BancoDataRow {
    id: number;
    nome: string;
    valorTotal: number;
  }

export type bancoSchemaType = z.infer<typeof bancoSchema>;