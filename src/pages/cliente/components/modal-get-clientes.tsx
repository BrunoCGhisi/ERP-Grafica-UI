import {
    Modal, TextField
} from "@mui/material";
import { ModalRoot } from "../../../shared/components/ModalRoot";
import "../../venda.css";
import { ClienteDataRow, clienteSchemaType } from "../../../shared/services/types";
import { GridRowParams } from "@mui/x-data-grid";
import dayjs from "dayjs";
import { PatternFormat } from "react-number-format";

interface ModalGetCliente {
    open: boolean
    rowData: ClienteDataRow | undefined
    toggleModal: () => void
    clientes: clienteSchemaType[]
}
export function ModalGetCliente({ rowData, open, toggleModal, clientes}: ModalGetCliente){

    const filterClientes = clientes.filter((cliente) => cliente.id === rowData?.id);
           
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
                   value={rowData?.nome}
                   inputProps={{ readOnly: true }}
                />

                <TextField
                   id="outlined-helperText"
                   label="Nome Fantasia"
                   value={rowData?.nomeFantasia}
                   inputProps={{ readOnly: true }}
                />
                <TextField
                   id="outlined-helperText"
                   label="CPF/CNPJ"
                   value={rowData?.cpfCnpj}
                   inputProps={{ readOnly: true }}
                />

                <PatternFormat
                    format="(##) #####-####" // Formato de telefone
                    mask="_"
                    customInput={TextField} // Utiliza TextField como input
                    inputProps={{ readOnly: true }}
                    value={rowData?.telefone}
                    label="Telefone"
                    fullWidth
                />

                <TextField
                   id="outlined-helperText"
                   label="E-Mail"
                   value={(rowData?.email)}
                   inputProps={{ readOnly: true }}
                />

                <TextField
                   id="outlined-helperText"
                   label="Perfil de Cadastro"
                   value={(rowData?.isFornecedor) == true ? "Fornecedor" : "Clientes" }
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
                    value={(rowData?.cep) || "Não cadastrado"}
                    inputProps={{ readOnly: true }}
                    fullWidth
                />
               <TextField
                   id="outlined-helperText"
                   label="Estado"
                   value={rowData?.estado ||"Não cadastrado"}
                   inputProps={{ readOnly: true }}
               />
               <TextField
                   id="outlined-helperText"
                   label="Cidade"
                   value={rowData?.cidade ||"Não cadastrado"}
                   inputProps={{ readOnly: true }}
               />
               <TextField
                   id="outlined-helperText"
                   label="Número"
                   value={rowData?.numero ||"Não cadastrado"}
                   inputProps={{ readOnly: true }}
               />
               <TextField
                   id="outlined-helperText"
                   label="Endereço"
                   value={rowData?.endereco ||"Não cadastrado"}
                   inputProps={{ readOnly: true }}
               />
               <TextField
                   id="outlined-helperText"
                   label="Complemento"
                   value={rowData?.complemento ||"Não cadastrado"}
                   inputProps={{ readOnly: true }}
               />
                <TextField
                   id="outlined-helperText"
                   label="Numéro da Inscrição Estadual"
                   value={rowData?.numIe ||"Não cadastrado"}
                   inputProps={{ readOnly: true }}
               />
                <TextField
                   id="outlined-helperText"
                   label="Status da Inscrição Estadual"
                   value={rowData?.statusIe ||"Não cadastrado"}
                   inputProps={{ readOnly: true }}
               />
             </ModalRoot>
           </Modal>
   )

}