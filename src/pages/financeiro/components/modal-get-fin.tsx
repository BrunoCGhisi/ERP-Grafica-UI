import {
  Modal,
  TextField,
  Typography,
  Grid
} from "@mui/material";
import { ModalRoot } from "../../../shared/components/ModalRoot";
import "../../venda.css";
import {
  financiaSchemaType,
  FinanciaDataRow,
  bancoSchemaType
} from "../../../shared/services/types";

interface ModalGetFinanceiro {
  open: boolean;
  rowData: FinanciaDataRow | undefined;
  toggleModal: () => void;
  financeiros: financiaSchemaType[];
  bancos: bancoSchemaType[];
}

export function ModalGetFinanceiro({
  rowData,
  open,
  toggleModal, financeiros, bancos
}: ModalGetFinanceiro) {

  const filterFinances = financeiros.filter((fin) => fin.id === rowData?.id);
  const filterBancos = bancos.filter((banco) => banco.id === rowData?.idBanco);

  let formaPgto = "";
  switch (rowData?.idFormaPgto) {
    case 1:
      formaPgto = "Dinheiro";
      break;
    case 2:
      formaPgto = "Débito";
      break;
    case 3:
      formaPgto = "Crédito";
      break;
    case 4:
      formaPgto = "PIX";
      break;
    case 5:
      formaPgto = "Boleto";
      break;
    case 6:
      formaPgto = "À prazo";
      break;
    case 7:
      formaPgto = "Cheque";
      break;
  }

  let situacao = "";
  switch (rowData?.situacao) {
    case 0:
      situacao = "Orçamento";
      break;
    case 2:
      situacao = "À receber";
      break;
    case 3:
      situacao = "Pago";
      break;
    case 4:
      situacao = "Recebido";
      break;
    case 1:
      situacao = "À pagar";
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
        <Typography variant="h6" gutterBottom>
          Dados Financeiros
        </Typography>

        {/* Grid para os campos principais */}
        <Grid container spacing={2}>
          <Grid item xs={4}>
            <TextField
              id="outlined-helperText"
              label="Descrição"
              value={rowData?.descricao}
              inputProps={{ readOnly: true }}
              fullWidth
            />
          </Grid>

          <Grid item xs={4}>
            <TextField
              id="outlined-helperText"
              label="Valor"
              value={rowData?.valor}
              inputProps={{ readOnly: true }}
              fullWidth
            />
          </Grid>

          {rowData?.situacao !== 0 && (
            <>
              <Grid item xs={4}>
                <TextField
                  id="outlined-helperText"
                  label="Data Vencimento"
                  value={rowData?.dataVencimento}
                  inputProps={{ readOnly: true }}
                  fullWidth
                />
              </Grid>

              <Grid item xs={4}>
                <TextField
                  id="outlined-helperText"
                  label="Data Competência"
                  value={rowData?.dataCompetencia}
                  inputProps={{ readOnly: true }}
                  fullWidth
                />
              </Grid>

              <Grid item xs={4}>
                <TextField
                  id="outlined-helperText"
                  label="Data Pagamento"
                  value={rowData?.dataPagamento || "Pagamento não efetuado"}
                  inputProps={{ readOnly: true }}
                  fullWidth
                />
              </Grid>
            </>
          )}

          <Grid item xs={4}>
            <TextField
              id="outlined-helperText"
              label="Situação do Pagamento"
              value={situacao || ""}
              inputProps={{ readOnly: true }}
              fullWidth
            />
          </Grid>

          <Grid item xs={4}>
            <TextField
              id="outlined-helperText"
              label="Parcelas"
              value={rowData?.parcelas}
              inputProps={{ readOnly: true }}
              fullWidth
            />
          </Grid>

          <Grid item xs={4}>
            <TextField
              id="outlined-helperText"
              label="Forma de Pagamento"
              value={formaPgto || ""}
              inputProps={{ readOnly: true }}
              fullWidth
            />
          </Grid>

          <Grid item xs={4}>
            <TextField
              id="outlined-helperText"
              label="Banco"
              value={filterBancos[0]?.nome || ""}
              inputProps={{ readOnly: true }}
              fullWidth
            />
          </Grid>
        </Grid>
      </ModalRoot>
    </Modal>
  );
}
