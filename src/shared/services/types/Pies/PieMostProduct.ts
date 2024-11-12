import { z } from "zod";


export const pieMostProductSchema = z.object({
    idProduto: z.string(),
    nome: z.string(),
    totalVendido: z.number(),
  });

export type pieMostProductSchemaType = z.infer<typeof pieMostProductSchema>;