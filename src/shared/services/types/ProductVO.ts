import { z } from "zod";

export const produtoSchema = z.object({
  id: z.number().optional(),
  nome: z.string(),
  tipo: z.boolean(),
  keyWord: z.string(),
  idCategoria: z.number(),
  idInsumo: z.number(),
  preco: z.coerce.number(),
  largura: z.coerce.number(),
  comprimento: z.coerce.number(),
});

export interface ProdutoDataRow {
  id: number;
  nome: string;
  tipo: boolean;
  keyWord: string;
  idCategoria: number;
  idInsumo: number;
  preco: number;
  largura: number;
  comprimento: number;
}
export type produtoSchemaType = z.infer<typeof produtoSchema>;