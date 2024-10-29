import { z } from "zod";

export const usuarioSchema = z.object({
  id: z.number().optional(),
  nome: z.string(),
  email: z.string(),
  senha: z.string(),
  isAdm: z.boolean(),
});

export interface UsuarioDataRow {
  id: number;
  nome: string;
  email: string;
  senha: string;
  isAdm: boolean;
}

export type usuarioSchemaType = z.infer<typeof usuarioSchema>;
