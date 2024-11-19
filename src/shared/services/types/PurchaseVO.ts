import { z } from "zod";
import {financeiroSchema} from "../types/SaleVO";
const compraInsumoSchema = z.object({
  idInsumo: z.number().optional(),
  idCompra: z.number().optional(),
  preco: z.coerce.number().optional(),
  largura: z.coerce.number().optional(),
  comprimento: z.coerce.number().optional(),
});

export const compraSchema = z.object({
  id: z.number().optional(),
  idFornecedor: z.coerce.number().optional(),
  isCompraOS: z.boolean().optional(),
  dataCompra: z.string().optional(),
  numNota: z.coerce.number().optional(),
  desconto: z.coerce.number().optional(),

  // compra Insumo
  compras_insumos: z.array(compraInsumoSchema).default([]),
  //Financeiro
  financeiros: z.array(financeiroSchema).default([]),
});

export interface CompraDataRow {
  id: number;
  idFornecedor: number;
  isCompraOS: boolean;
  dataCompra: string;
  numNota: number;
  desconto: number;

  compras_insumos: { idInsumo: number; preco: number; tamanho: number }[];
  //Financeiro
  financeiros: {parcelas: number; idFormaPgto: number; idBanco: number}[];
}

export type compraInsumoSchemaType = z.infer<typeof compraInsumoSchema>;
export type compraSchemaType = z.infer<typeof compraSchema>;