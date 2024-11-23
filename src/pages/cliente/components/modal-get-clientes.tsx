import {
    Modal, TextField
} from "@mui/material";
import { ModalRoot } from "../../../shared/components/ModalRoot";
import "../../venda.css";
import { clienteSchemaType } from "../../../shared/services/types";
import { GridRowParams } from "@mui/x-data-grid";
import dayjs from "dayjs";
import { PatternFormat } from "react-number-format";

interface ModalGetCliente {
    open: boolean
    rowData: GridRowParams<any> | null
    toggleModal: () => void
    clientes: clienteSchemaType[]
}
export function ModalGetCliente({ rowData, open, toggleModal, clientes}: ModalGetCliente){

    const filterClientes = clientes.filter((cliente) => cliente.id === rowData?.row.id);
           
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
                   label="Nome"
                   value={rowData?.row.nome}
                   inputProps={{ readOnly: true }}
                />

                <TextField
                   id="outlined-helperText"
                   label="Nome Fantasia"
                   value={rowData?.row.nomeFantasia}
                   inputProps={{ readOnly: true }}
                />
                <TextField
                   id="outlined-helperText"
                   label="CPF/CNPJ"
                   value={rowData?.row.cpfCnpj}
                   inputProps={{ readOnly: true }}
                />

                <PatternFormat
                    format="(##) #####-####" // Formato de telefone
                    mask="_"
                    customInput={TextField} // Utiliza TextField como input
                    inputProps={{ readOnly: true }}
                    value={rowData?.row.telefone}
                    label="Telefone"
                    fullWidth
                />

                <TextField
                   id="outlined-helperText"
                   label="E-Mail"
                   value={(rowData?.row.email)}
                   inputProps={{ readOnly: true }}
                />

                <TextField
                   id="outlined-helperText"
                   label="Perfil de Cadastro"
                   value={(rowData?.row.email) == true ? "Fornecedor" : "Clientes" }
                   inputProps={{ readOnly: true }}
                />

                 <TextField
                   type="date"
                   id="outlined-helperText"
                   label={"Data de cadastro"}
                   InputLabelProps={{ shrink: true }}
                   inputProps={{ readOnly: true }}
                   value={dayjs(filterClientes[0].dataCadastro).format("YYYY-MM-DD")}            
                 />
                <PatternFormat
                    id="outlined-helperText"
                    format="####-####" // Formato de telefone
                    mask="_"
                    customInput={TextField} // Utiliza TextField como input
                    label="CEP"
                    value={(rowData?.row.cep) || "Não cadastrado"}
                    inputProps={{ readOnly: true }}
                    fullWidth
                />
               <TextField
                   id="outlined-helperText"
                   label="Estado"
                   value={rowData?.row.estado ||"Não cadastrado"}
                   inputProps={{ readOnly: true }}
               />
               <TextField
                   id="outlined-helperText"
                   label="Cidade"
                   value={rowData?.row.cidade ||"Não cadastrado"}
                   inputProps={{ readOnly: true }}
               />
               <TextField
                   id="outlined-helperText"
                   label="Número"
                   value={rowData?.row.numero ||"Não cadastrado"}
                   inputProps={{ readOnly: true }}
               />
               <TextField
                   id="outlined-helperText"
                   label="Endereço"
                   value={rowData?.row.endereco ||"Não cadastrado"}
                   inputProps={{ readOnly: true }}
               />
               <TextField
                   id="outlined-helperText"
                   label="Complemento"
                   value={rowData?.row.complemento ||"Não cadastrado"}
                   inputProps={{ readOnly: true }}
               />
                <TextField
                   id="outlined-helperText"
                   label="Numéro da Inscrição Estadual"
                   value={rowData?.row.numIe ||"Não cadastrado"}
                   inputProps={{ readOnly: true }}
               />
                <TextField
                   id="outlined-helperText"
                   label="Status da Inscrição Estadual"
                   value={rowData?.row.statusIe ||"Não cadastrado"}
                   inputProps={{ readOnly: true }}
               />
             </ModalRoot>
           </Modal>
   )

}