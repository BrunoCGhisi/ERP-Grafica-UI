import { z } from "zod";

const compraProdutoSchema = z.object({
    idProduto: z.number().optional(),
    preco: z.coerce.number().optional(),
    quantidade: z.coerce.number().optional(),
    tamanho: z.coerce.number().optional()
  });

export const compraSchema = z.object({
    id: z.number().optional(),
    idFornecedor: z.coerce.number(),
    isCompraOS: z.boolean(),
    dataCompra: z.string(),
    numNota: z.coerce.number(),
    desconto: z.coerce.number(),
    isOpen: z.boolean(),
    // compra produto
    compras_produtos: z.array(compraProdutoSchema).default([]),
  })
  
export interface CompraDataRow {
    id: number,
    idFornecedor: number,
    isCompraOS: boolean,
    dataCompra: string,
    numNota: number,
    desconto: number,
    isOpen: boolean
  }
  
export type compraSchemaType = z.infer<typeof compraSchema>