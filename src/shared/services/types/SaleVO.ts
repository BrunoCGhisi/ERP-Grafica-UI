import { z } from "zod";

const vendaProdutoSchema = z.object({
  id: z.number().optional(),
  idVenda: z.number().optional(),
  idProduto: z.number().optional(),
  quantidade: z.coerce.number().optional(),
});

const financeiroSchema = z.object({
  id: z.number().optional(),
  idVenda: z.number().optional(),
  parcelas: z.coerce.number().optional(),
  idForma_pgto: z.coerce.number().optional(),
});
export const vendaSchema = z.object({
  //venda
  id: z.number().optional(),
  idBanco: z.coerce.number().optional(),
  nomeCliente: z.string().optional(),
  idCliente: z.number().optional(),
  idVendedor: z.coerce.number().optional(),
  dataAtual: z.string().optional(),
  isVendaOS: z.boolean().optional(),
  situacao: z.number().optional(),
  desconto: z.number().optional(),
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
  isVendaOS: boolean;
  situacao: number;
  desconto: number;
  vendas_produtos: {idProduto: number; quantidade: number}[];
  financeiro: {parcelas: number; idForma_pgto: number}[];
}
export type financeiroSchemaType = z.infer<typeof financeiroSchema>;
export type vendaProdutoSchemaType = z.infer<typeof vendaProdutoSchema>;
export type vendaSchemaType = z.infer<typeof vendaSchema>;
