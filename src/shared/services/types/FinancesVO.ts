import { z } from "zod";

export const financiaSchema = z.object({
  id: z.number().optional(),
  idVenda: z.number().optional(),
  idCompra: z.number().optional(),
  idFormaPgto: z.number().optional(),
  idBanco: z.number().optional(),
  descricao: z.string().optional(),
  isPagarReceber: z.boolean().optional(),
  valor: z.coerce.number().optional(),
  dataVencimento: z.coerce.string().optional(),
  dataCompetencia: z.coerce.string().optional(),
  dataPagamento: z.coerce.string().optional(),
  situacao: z.coerce.number().optional(),
  parcelas: z.coerce.number().optional(),
});

export interface FinanciaDataRow {
  id: number;
  idVenda: number;
  idCompra: number;
  idFormaPgto: number;
  idBanco: number;
  descricao: string;
  isPagarReceber: boolean;
  valor: number;
  dataVencimento: string;
  dataCompetencia: string;
  dataPagamento: string;
  situacao: number;

  parcelas: number;
}

export type financiaSchemaType = z.infer<typeof financiaSchema>;
