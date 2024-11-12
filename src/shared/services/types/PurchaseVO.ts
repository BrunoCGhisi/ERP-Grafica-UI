import { z } from "zod";

const compraProdutoSchema = z.object({
  idInsumo: z.number().optional(),
  preco: z.coerce.number().optional(),
  tamanho: z.coerce.number().optional(),
});

export const compraSchema = z.object({
  id: z.number().optional(),
  idFornecedor: z.coerce.number().optional(),
  isCompraOS: z.boolean().optional(),
  dataCompra: z.string().optional(),
  numNota: z.coerce.number().optional(),
  desconto: z.coerce.number().optional(),
  isOpen: z.boolean().optional(),
  // compra produto
  compras_insumos: z.array(compraProdutoSchema).default([]),
  //Financeiro
  idbanco: z.coerce.number().optional(),
  parcelas: z.coerce.number().optional().optional(),
  idForma_pgto: z.coerce.number().optional().optional(),
});

export interface CompraDataRow {
  id: number;
  idFornecedor: number;
  isCompraOS: boolean;
  dataCompra: string;
  numNota: number;
  desconto: number;
  isOpen: boolean;
  compras_insumos: { idInsumo: number; preco: number; tamanho: number }[];
  //Financeiro
  parcelas: number;
  idForma_pgto: number;
}

export type compraSchemaType = z.infer<typeof compraSchema>;