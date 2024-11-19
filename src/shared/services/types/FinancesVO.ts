import { z } from "zod";

export const financiaSchema = z.object({
  id: z.number().optional(),
  idVenda: z.number(),
  idBanco: z.number(),
  descricao: z.string(),
  isPagarReceber: z.number(),
  valor: z.coerce.number(),
  dataVencimento: z.coerce.string(),
  dataCompetencia: z.coerce.string(),
  dataPagamento: z.coerce.string(),
  situacao: z.coerce.number(),

  parcelas: z.coerce.number(),
});

export interface FinanciaDataRow {
  id: number;
  idVenda: number;
  idBanco: number;
  descricao: string;
  isPagarReceber: number;
  valor: number;
  dataVencimento: string;
  dataCompetencia: string;
  dataPagamento: string;
  situacao: number;

  parcelas: number;
}

export type financiaSchemaType = z.infer<typeof financiaSchema>;
