import { z } from "zod";

export const produtoSchema = z.object({
  id: z.number().optional(),
  nome: z.string().min(1, "Campo obrigatório"),
  tipo: z.boolean(),
  keyWord: z.string().optional(),
  idCategoria: z.number().min(1, "Campo obrigatório"),
  idInsumo: z.number().min(1, "Campo obrigatório"),
  largura: z.coerce.number(),
  comprimento: z.coerce.number(),
  isActive: z.boolean().optional(),
});

export interface ProdutoDataRow {
  id: number ;
  nome: string;
  tipo: boolean;
  keyWord: string;
  idCategoria: number;
  idInsumo: number;
  largura: number;
  comprimento: number;
  isActive: boolean;
}
export type produtoSchemaType = z.infer<typeof produtoSchema>;