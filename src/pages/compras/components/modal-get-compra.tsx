import {
    Box,
    Modal, TextField,
    Typography,
} from "@mui/material";
import { useFieldArray, useForm } from "react-hook-form";
import { ModalRoot } from "../../../shared/components/ModalRoot";
import "../../venda.css";
import { financeiroSchemaType, compraSchemaType, compraInsumoSchemaType, compraSchema, insumoSchemaType } from "../../../shared/services/types";
import { GridRowParams } from "@mui/x-data-grid";
import { zodResolver } from "@hookform/resolvers/zod";
import dayjs from "dayjs";

interface ModalGetCompra {
    open: boolean
    rowData: GridRowParams<any> | null
    toggleModal: () => void
    fornecedores : {
        nome: string; 
        id?: number | undefined;
    }[]
    compras: compraSchemaType[]
    comprasInsumos: compraInsumoSchemaType[]
    financeiro: financeiroSchemaType[]
    insumos: insumoSchemaType[]
}
export function ModalGetCompra({fornecedores, rowData, open, toggleModal, compras, financeiro, comprasInsumos, insumos}: ModalGetCompra){

    const filterCompras = compras.filter((compra) => compra.id === rowData?.row.id);
    const idCompras = filterCompras.map((compra) => compra.id);
    const fornecedor = fornecedores.filter((fornecedor) => fornecedor.id === filterCompras[0].idFornecedor);
    
    const compra_insumo = comprasInsumos.filter((ci) => idCompras.includes(ci.idCompra));
    const financeiros = financeiro.filter((fin) => idCompras.includes(fin.idCompra));

    const { control } = useForm<compraSchemaType>({
        resolver: zodResolver(compraSchema),
        defaultValues: {
            compras_insumos: compra_insumo.map((ci) => ({ idInsumo: ci?.idInsumo, preco: ci?.preco,  largura: ci?.largura, comprimento: ci?.comprimento }))
        }
       });
           
   const { fields } = useFieldArray({
       control,
       name: "compras_insumos",
   });

   let formaPgto = "" 
   switch (financeiro[0].idFormaPgto) {
       case 1:
           formaPgto = "Dinheiro";
           break;
       case 2:
           formaPgto = "Débito"
           break;
       case 3:
           formaPgto = "Crédito"
           break;
       case 4:
           formaPgto = "PIX"
           break;
       case 5:
           formaPgto = "Boleto"
           break;
       case 6:
           formaPgto = "À prazo"
           break;
       case 7:
           formaPgto = "Cheque"
           break;
   }

   return (
       <Modal
             open={open}
             onClose={toggleModal}
             aria-labelledby="modal-modal-title"
             aria-describedby="modal-modal-description"
           >
             <ModalRoot>

               <TextField
                   id="outlined-helperText"
                   label="Fornecedor"
                   value={fornecedor[0].nome}
                   inputProps={{ readOnly: true }}
                   
                 />

                 <TextField
                   type="date"
                   id="outlined-helperText"
                   label={"Data compra"}
                   InputLabelProps={{ shrink: true }}
                   value={dayjs(filterCompras[0].dataCompra).format("YYYY-MM-DD")}
                   
                 />
                 <TextField
                   id="outlined-helperText"
                   label="Desconto"
                   value={(rowData?.row.desconto) || ""}
                 />

               <TextField
                   id="outlined-helperText"
                   label="Compra ou Orçamento"
                   value={rowData?.row.isVendaOS == true ? "Compra" : "Orçamento"}
               />
               <TextField
                   id="outlined-helperText"
                   label="Número da nota"
                   value={rowData?.row.numNota}
               />

               <TextField
                   id="outlined-helperText"
                   label="Banco"
                   value={financeiros[0].idBanco}
               />

               <TextField
                   id="outlined-helperText"
                   label="Forma de Pagamento"
                   value={formaPgto}
               />

               <TextField
                   id="outlined-helperText"
                   label="Parcelas"
                   value={financeiros[0].parcelas}
               />

            
                 <Typography variant="h6">Insumos Comprados</Typography>
                 {fields.map((item) => (
                   <Box
                     key={item.id}
                     display="flex"
                     alignItems="center"
                     gap={2}
                   >
                   <TextField
                       id="outlined-helperText"
                       label="Insumos"
                       value={insumos.find((insumo) => insumo.id === item.idInsumo)?.nome || ""}
                   />
                   <TextField
                       id="outlined-helperText"
                       label="Quantidade"
                       value={item.largura}
                   />

                    <TextField
                       id="outlined-helperText"
                       label="Quantidade"
                       value={item.comprimento}
                   />

                    <TextField
                       id="outlined-helperText"
                       label="Quantidade"
                       value={item.preco}
                   />
                   </Box> ))}

             </ModalRoot>
           </Modal>
   )

}