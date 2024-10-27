import { z } from "zod";

export const vendaSchema = z.object({
  //venda
  id: z.number().optional(),
  idCliente: z.number(),
  idVendedor: z.coerce.number(),
  dataAtual: z.string(),
  isVendaOS: z.boolean(),
  situacao: z.number(),
  desconto: z.number(),
  //vendaProduto
  idProduto: z.number(),
  quantidade: z.number(),
  //Financeiro
  parcelas: z.number().optional(),
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

export type vendaSchemaType = z.infer<typeof vendaSchema>;
