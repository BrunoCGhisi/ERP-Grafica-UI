import { z } from "zod";


const vendaProdutoSchema = z.object({
  idProduto: z.number().optional(),
  quantidade: z.coerce.number().optional(),
});

export const vendaSchema  = z.object({
  //venda
  id: z.number().optional(),
  idCliente: z.number(),
  idVendedor: z.coerce.number(),
  dataAtual: z.string(),
  isVendaOS: z.boolean(),
  situacao: z.number(),
  desconto: z.number(),
  //vendaProduto
  vendas_produtos: z.array(vendaProdutoSchema).default([]),
  //Financeiro
  parcelas: z.coerce.number(),
  idForma_pgto: z.coerce.number(),
});

export interface VendaDataRow {
  id: number;
  idCliente: number;
  idVendedor: number;
  dataAtual: string;
  isVendaOS: boolean;
  situacao: number;
  desconto: number;
}

export type vendaSchemaType = z.infer<typeof vendaSchema >;
