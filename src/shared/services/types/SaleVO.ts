import { z } from "zod";

const vendaProdutoSchema = z.object({
  id: z.number().optional(),
  idVenda: z.number().optional(),
  idProduto: z.number(),
  quantidade: z.coerce.number(),
});

export const financeiroSchema = z.object({
  id: z.number().optional(),
  idVenda: z.number().optional(),
  idCompra: z.number().optional(),
  parcelas: z.coerce.number(),
  idFormaPgto: z.coerce.number(),
  idBanco: z.coerce.number(),
  valor: z.coerce.number().optional()
});

export const vendaSchema = z.object({
  //venda
  id: z.number().optional(),
  idCliente: z.number(),
  idVendedor: z.coerce.number(),
  dataAtual: z.string(),
  isVendaOS: z.number(),
  situacao: z.number(),
  desconto: z.number(),
  //Venda Produto
  vendas_produtos: z.array(vendaProdutoSchema).default([]),
  //Financeiro
  financeiro: z.array(financeiroSchema).default([]),
});

export interface VendaDataRow {
  id: number;
  idCliente: number;
  idVendedor: number;
  dataAtual: string;
  isVendaOS: number;
  situacao: number;
  desconto: number;
  vendas_produtos: {idProduto: number; quantidade: number}[];
  financeiro: {parcelas: number; idFormaPgto: number; idBanco: number, valor: number}[];
}
export type financeiroSchemaType = z.infer<typeof financeiroSchema>;
export type vendaProdutoSchemaType = z.infer<typeof vendaProdutoSchema>;
export type vendaSchemaType = z.infer<typeof vendaSchema>;
