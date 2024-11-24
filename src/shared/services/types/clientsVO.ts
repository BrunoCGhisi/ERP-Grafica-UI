import { z } from "zod";

export const clienteSchema = z.object({
    id: z.number().optional(),
    nome: z.string().refine((doc) => doc.trim() !== "",{
      message: "Campo obrigatório"
    }),
    nomeFantasia: z.string().optional(),
    cpfCnpj: z.string().
    refine((doc) => /^[0-9]+$/.test(doc), {
      message:'CPF/CNPJ deve conter apenas números.'
    })
    .refine((doc) => {
      return doc.length >= 11;
    }, 'CPF/CNPJ deve conter no mínimo 11 caracteres.')
    .refine((doc) => {
      return doc.length <= 14;
    }, 'CPF/CNPJ deve conter no máximo 14 caracteres.'),

    telefone: z.string().transform((val) => val.replace(/[^0-9]/g, "")).refine((doc) => {
      return doc.length >= 11;}, 'CPF/CNPJ deve conter no mínimo 11 caracteres.'),
      email: z
      .string()
      .email({ message: "Insira um email válido." }) 
      .refine((email) => email.trim() !== "", {
        message: "Email é obrigatório.",
      }),
    isFornecedor: z.boolean(),
    dataCadastro: z.string().optional(),
    cep: z.string().transform((val) => val.replace(/[^0-9]/g, "")).refine((doc) => {
        return doc.length >= 8;}, 'CEP deve conter 8 caracteres.').optional(),
    estado: z.string().optional(),
    cidade: z.string().optional(),
    numero: z.string().optional(),
    endereco: z.string().optional(),
    complemento: z.string().optional(),
    numIe: z.string().optional(),
    statusIe: z.boolean(),
    
  });
  
  
export interface ClienteDataRow {
    id: number,
    nome: string,
    nomeFantasia: string,
    cpfCnpj: string,
    telefone: string,
    email: string,
    isFornecedor: boolean,
    dataCadastro: string,
    cep: string,
    estado: string,
    cidade: string,
    numero: string,
    endereco: string,
    complemento: string,
    numIe: string,
    statusIe: boolean,
  }
  
export type clienteSchemaType = z.infer<typeof clienteSchema>;