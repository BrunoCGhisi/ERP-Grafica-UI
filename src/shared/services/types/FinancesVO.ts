import { z } from "zod";

export const financiaSchema = z.object({
  id: z.number().optional(),
  idVenda: z.number().optional(),
  idBanco: z.number().optional(),
  descricao: z.string().optional(),
  isPagarReceber: z.number().optional(),
  valor: z.coerce.number().optional(),
  dataVencimento: z.coerce.string().optional(),
  dataCompetencia: z.coerce.string().optional(),
  dataPagamento: z.coerce.string().optional(),
  situacao: z.coerce.number().optional(),

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
