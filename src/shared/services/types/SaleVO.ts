import { z } from "zod";

export const vendaSchema = z.object({
    id: z.number().optional(),
    idCliente: z.number(),
    idVendedor: z.number(),
    data: z.string(),
    isVendaOS: z.boolean(),
    situacao: z.number(),
    desconto: z.number(),
  });
  
export interface VendaDataRow {
    id: number;
    idCliente: number;
    idVendedor: number;
    data: string;
    isVendaOS: boolean;
    situacao: number;
    desconto: number;

  }

export type vendaSchemaType = z.infer<typeof vendaSchema>;
