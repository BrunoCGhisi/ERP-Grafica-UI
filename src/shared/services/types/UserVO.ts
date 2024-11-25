import { z } from "zod";

export const usuarioSchema = z.object({
  id: z.number().optional(),
  nome: z.string().min(1, "Campo Obrigatório"),
  email: z.string().email().min(1, "Campo Obrigatório").optional(),
  senha: z.string().min(5, "A senha deve conter pelo menos 5 caracteres").optional(),
  isAdm: z.boolean().optional(),
  isActive: z.boolean().optional(),
});

export interface UsuarioDataRow {
  id: number;
  nome: string;
  email: string;
  senha: string;
  isAdm: boolean;
  isActive: boolean;
}

export type usuarioSchemaType = z.infer<typeof usuarioSchema>;
