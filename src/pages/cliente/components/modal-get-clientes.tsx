import { Modal, TextField, Grid, Typography } from "@mui/material";
import { ModalRoot } from "../../../shared/components/ModalRoot";
import "../../venda.css";
import {
  ClienteDataRow,
  clienteSchemaType,
} from "../../../shared/services/types";
import { GridRowParams } from "@mui/x-data-grid";
import dayjs from "dayjs";
import { PatternFormat } from "react-number-format";

interface ModalGetCliente {
  open: boolean;
  rowData: ClienteDataRow | undefined;
  toggleModal: () => void;
  clientes: clienteSchemaType[];
}
export function ModalGetCliente({
  rowData,
  open,
  toggleModal,
  clientes,
}: ModalGetCliente) {
  const filterClientes = clientes.filter(
    (cliente) => cliente.id === rowData?.id
  );

  return (
    <Modal
      open={open}
      onClose={toggleModal}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <ModalRoot>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="h6">Dados do Cliente</Typography>
          </Grid>
          <Grid item xs={4} sx={{mt: 0}}>
            <TextField
              id="outlined-helperText"
              label="Nome"
              value={rowData?.nome}
              inputProps={{ readOnly: true }}
              fullWidth
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              id="outlined-helperText"
              label="Nome Fantasia"
              value={rowData?.nomeFantasia}
              inputProps={{ readOnly: true }}
              fullWidth
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              id="outlined-helperText"
              label="CPF/CNPJ"
              value={rowData?.cpfCnpj}
              inputProps={{ readOnly: true }}
              fullWidth
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              id="outlined-helperText"
              label="E-Mail"
              value={rowData?.email}
              inputProps={{ readOnly: true }}
              fullWidth
            />
          </Grid>
          <Grid item xs={4}>
            <PatternFormat
              format="(##) #####-####"
              mask="_"
              customInput={TextField}
              inputProps={{ readOnly: true }}
              value={rowData?.telefone}
              label="Telefone"
              fullWidth
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              type="date"
              id="outlined-helperText"
              label={"Data de cadastro"}
              InputLabelProps={{ shrink: true }}
              inputProps={{ readOnly: true }}
              value={dayjs(filterClientes[0].dataCadastro).format("YYYY-MM-DD")}
              fullWidth
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              id="outlined-helperText"
              label="Perfil de Cadastro"
              value={rowData?.isFornecedor == true ? "Fornecedor" : "Clientes"}
              inputProps={{ readOnly: true }}
              fullWidth
            />
          </Grid>

          <Grid item xs={4}>
            <TextField
              id="outlined-helperText"
              label="Número da Inscrição Estadual"
              value={rowData?.numIe || "Não cadastrado"}
              inputProps={{ readOnly: true }}
              fullWidth
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              id="outlined-helperText"
              label="Status da Inscrição Estadual"
              value={rowData?.statusIe || "Não cadastrado"}
              inputProps={{ readOnly: true }}
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h6">Endereçamento</Typography>
          </Grid>
          <Grid item xs={4} sx={{mb:0}}>
            <PatternFormat
              id="outlined-helperText"
              format="#####-###"
              mask="_"
              customInput={TextField}
              label="CEP"
              value={rowData?.cep || "Não cadastrado"}
              inputProps={{ readOnly: true }}
              fullWidth
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              id="outlined-helperText"
              label="Estado"
              value={rowData?.estado || "Não cadastrado"}
              inputProps={{ readOnly: true }}
              fullWidth
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              id="outlined-helperText"
              label="Cidade"
              value={rowData?.cidade || "Não cadastrado"}
              inputProps={{ readOnly: true }}
              fullWidth
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              id="outlined-helperText"
              label="Número"
              value={rowData?.numero || "Não cadastrado"}
              inputProps={{ readOnly: true }}
              fullWidth
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              id="outlined-helperText"
              label="Endereço"
              value={rowData?.endereco || "Não cadastrado"}
              inputProps={{ readOnly: true }}
              fullWidth
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              id="outlined-helperText"
              label="Complemento"
              value={rowData?.complemento || "Não cadastrado"}
              inputProps={{ readOnly: true }}
              fullWidth
            />
          </Grid>
        </Grid>
      </ModalRoot>
    </Modal>
  );
}
