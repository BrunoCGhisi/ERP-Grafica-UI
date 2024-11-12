import { z } from "zod";

export const produtoSchema = z.object({
  id: z.number().optional(),
  nome: z.string(),
  tipo: z.boolean(),
  keyWord: z.string(),
  idCategoria: z.number(),
  idInsumo: z.number(),
  preco: z.coerce.number(),
  tamanho: z.coerce.number(),
});

export interface ProdutoDataRow {
  id: number;
  nome: string;
  tipo: boolean;
  keyWord: string;
  idCategoria: number;
  idInsumo: number;
  preco: number;
  tamanho: number;
}
export type produtoSchemaType = z.infer<typeof produtoSchema>;