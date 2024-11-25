import { Box, Grid, Modal, TextField, Typography, InputAdornment } from "@mui/material";
import { useFieldArray, useForm } from "react-hook-form";
import { ModalRoot } from "../../../shared/components/ModalRoot";
import "../../venda.css";
import {
  financeiroSchemaType,
  compraSchemaType,
  compraInsumoSchemaType,
  compraSchema,
  insumoSchemaType,
  bancoSchemaType,
  CompraDataRow,
} from "../../../shared/services/types";
import { GridRowParams } from "@mui/x-data-grid";
import { zodResolver } from "@hookform/resolvers/zod";
import dayjs from "dayjs";
import { NumericFormat } from "react-number-format";

interface ModalGetCompra {
  open: boolean;
  rowData: CompraDataRow | undefined;
  toggleModal: () => void;
  fornecedores: {
    nome: string;
    id?: number | undefined;
  }[];
  compras: compraSchemaType[];
  comprasInsumos: compraInsumoSchemaType[];
  financeiro: financeiroSchemaType[];
  insumos: insumoSchemaType[];
  bancos: bancoSchemaType[];
}
export function ModalGetCompra({
  bancos,
  fornecedores,
  rowData,
  open,
  toggleModal,
  compras,
  financeiro,
  comprasInsumos,
  insumos,
}: ModalGetCompra) {
  const filterCompras = compras.filter((compra) => compra.id === rowData?.id);
  const idCompras = filterCompras.map((compra) => compra.id);
  const fornecedor = fornecedores.filter(
    (fornecedor) => fornecedor.id === filterCompras[0].idFornecedor
  );

  const compra_insumo = comprasInsumos.filter((ci) =>
    idCompras.includes(ci.idCompra)
  );
  const financeiros = financeiro.filter((fin) =>
    idCompras.includes(fin.idCompra)
  );

  const filterBancos = bancos.filter(
    (banco) => banco.id === financeiros[0].idBanco  
  );

  const { control } = useForm<compraSchemaType>({
    resolver: zodResolver(compraSchema),
    defaultValues: {
      compras_insumos: compra_insumo.map((ci) => ({
        idInsumo: ci?.idInsumo,
        preco: ci?.preco,
        largura: ci?.largura,
        comprimento: ci?.comprimento,
      })),
    },
  });

  const { fields } = useFieldArray({
    control,
    name: "compras_insumos",
  });

  let formaPgto = "";
  switch (financeiro[0].idFormaPgto) {
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

  return (
    <Modal
      open={open}
      onClose={toggleModal}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <ModalRoot>
      <Typography variant="h6">Dados da Compra</Typography>
        <Grid container spacing={2} sx={{mt: 0}}>
          <Grid item xs={3}>
            <TextField
              id="outlined-helperText"
              label="Fornecedor"
              value={fornecedor[0].nome}
              inputProps={{ readOnly: true }}
            />
          </Grid>
          <Grid item xs={3}>
            <TextField
              type="date"
              id="outlined-helperText"
              label={"Data compra"}
              fullWidth
              InputLabelProps={{ shrink: true }}
              inputProps={{ readOnly: true }}
              value={dayjs(filterCompras[0].dataCompra).format("YYYY-MM-DD")}
            />
          </Grid>
          <Grid item xs={3}>
            <TextField
              id="outlined-helperText"
              label="Desconto"
              value={ `${rowData?.desconto}%` || "Sem desconto"}
              inputProps={{ readOnly: true }}
            />
          </Grid>

          <Grid item xs={3}>
            <TextField
              id="outlined-helperText"
              label="Compra ou Orçamento"
              inputProps={{ readOnly: true }}
              value={rowData?.isVendaOS == true ? "Compra" : "Orçamento"}
            />
          </Grid>
        </Grid>
        <Grid container spacing={2} sx={{mt: 0.5, mb: 2}}>
          <Grid item xs={3}>
            <TextField
              id="outlined-helperText"
              label="Número da nota"
              inputProps={{ readOnly: true }}
              value={rowData?.numNota}
            />
          </Grid>

          <Grid item xs={3}>
            <TextField
              id="outlined-helperText"
              label="Banco"
              value={filterBancos[0].nome}
              inputProps={{ readOnly: true }}
            />
          </Grid>
          <Grid item xs={3}>
            <TextField
              id="outlined-helperText"
              label="Forma de Pagamento"
              value={formaPgto}
              inputProps={{ readOnly: true }}
            />
          </Grid>
          <Grid item xs={3}>
            <TextField
              id="outlined-helperText"
              label="Parcelas"
              value={financeiros[0].parcelas}
              inputProps={{ readOnly: true }}
            />
          </Grid>
        </Grid>
        <Typography variant="h6">Insumos Comprados</Typography>
        {fields.map((item) => (
          <Box key={item.id} display="flex" alignItems="center" gap={2} marginBottom={2}  marginTop={2}>
            <TextField
              id="outlined-helperText"
              label="Insumo"
              value={
                insumos.find((insumo) => insumo.id === item.idInsumo)?.nome ||
                ""
              }
              inputProps={{ readOnly: true }}
            />
            <TextField
              id="outlined-helperText"
              label="Largura"
              value={`${item.largura} m`}
              inputProps={{ readOnly: true }}
            />

            <TextField
              id="outlined-helperText"
              label="Comprimento"
              value={`${item.comprimento} m`}
              inputProps={{ readOnly: true }}
            
            />

            <NumericFormat
              customInput={TextField}
              prefix="R$"
              fullWidth
              id="outlined-helperText"
              label="Preço por m²"
              thousandSeparator="."
              decimalSeparator=","
              allowLeadingZeros
              value={item.preco}
              inputProps={{ readOnly: true }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">R$</InputAdornment>
                ),
              }}
            />
          </Box>
        ))}
      </ModalRoot>
    </Modal>
  );
}
