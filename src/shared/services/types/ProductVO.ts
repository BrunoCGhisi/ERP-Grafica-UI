import { z } from "zod";

export const produtoSchema = z.object({
  id: z.number().optional(),
  nome: z.string().min(1, "Campo obrigatório"),
  tipo: z.boolean(),
  keyWord: z.string().min(1, "Campo obrigatório"),
  idCategoria: z.number().min(1, "Campo obrigatório"),
  idInsumo: z.number().min(1, "Campo obrigatório"),
  preco: z.coerce.number().min(1, "Campo obrigatório"),
  largura: z.coerce.number().min(1, "Campo obrigatório"),
  comprimento: z.coerce.number().min(1, "Campo obrigatório"),
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