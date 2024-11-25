import {
  Box,
  Modal,
  TextField,
  Typography,
  Grid,
  InputAdornment,
} from "@mui/material";
import { useFieldArray, useForm } from "react-hook-form";
import { ModalRoot } from "../../../shared/components/ModalRoot";
import "../../venda.css";
import {
  vendaSchema,
  vendaSchemaType,
  vendaProdutoSchemaType,
  financeiroSchemaType,
  VendaDataRow,
  bancoSchemaType,
} from "../../../shared/services/types";
import { GridRowParams } from "@mui/x-data-grid";
import { zodResolver } from "@hookform/resolvers/zod";
import { produtoSchemaType } from "../../../shared/services/types";

interface ModalGetVenda {
  open: boolean;
  rowData: VendaDataRow | undefined;
  toggleModal: () => void;
  clientes: {
    nome: string;
    id?: number | undefined;
  }[];
  produtos: produtoSchemaType[];
  vendasProdutos: vendaProdutoSchemaType[];
  vendas: vendaSchemaType[];
  financeiro: financeiroSchemaType[];
  bancos: bancoSchemaType[]
}

export function ModalGetVenda({
  rowData,
  open,
  toggleModal,
  clientes,
  vendas,
  financeiro,
  produtos,
  vendasProdutos,
  bancos
}: ModalGetVenda) {
  
  const filterVendas = vendas.filter((venda) => venda.id === rowData?.id);
  const idVendas = filterVendas.map((venda) => venda.id);
  const venda_produto = vendasProdutos.filter((vp) =>
    idVendas.includes(vp.idVenda)
  );
  const cliente = clientes.filter(
    (cliente) => cliente.id === filterVendas[0].idCliente
  );
  const financeiros = financeiro.filter((fin) =>
    idVendas.includes(fin.idVenda)
  );

  const filterBancos = bancos.filter(
    (banco) => banco.id === financeiros[0].idBanco
  );

  const { control } = useForm<vendaSchemaType>({
    resolver: zodResolver(vendaSchema),
    defaultValues: {
      vendas_produtos: venda_produto.map((vp) => ({
        idProduto: vp?.idProduto,
        quantidade: vp?.quantidade,
      })),
    },
  });

  const { fields } = useFieldArray({
    control,
    name: "vendas_produtos",
  });

  let formaPgto = "";
  switch (financeiros[0].idFormaPgto) {
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
      situacao = "Em espera";
      break;
    case 2:
      situacao = "Em execução";
      break;
    case 3:
      situacao = "Em acabamento";
      break;
    case 4:
      situacao = "Finalizado";
      break;
    case 1:
      situacao = "Em criação (arte)";
      break;
    case 5:
      situacao = "Entregue";
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
          Dados da Venda
        </Typography>
        {/* Grid para os campos principais */}
        <Grid container spacing={2}>
          <Grid item xs={3}>
            <TextField
              id="outlined-helperText"
              label="Vendedor"
              value={rowData?.idVendedor}
              inputProps={{ readOnly: true }}
            />
          </Grid>
          <Grid item xs={3}>
            <TextField
              id="outlined-helperText"
              label="Clientes"
              value={cliente[0]?.nome || ""}
              inputProps={{ readOnly: true }}
            />
          </Grid>
          <Grid item xs={3}>
            <TextField
              type="date"
              id="outlined-helperText"
              label="Data da Venda"
              fullWidth
              InputLabelProps={{ shrink: true }}
              inputProps={{ readOnly: true }}
              value={filterVendas[0]?.dataAtual || ""}
            />
          </Grid>
          <Grid item xs={3}>
            <TextField
              id="outlined-helperText"
              label="Desconto"
              value={`${rowData?.desconto}%` || ""}
              inputProps={{ readOnly: true }}
            />
          </Grid>
        </Grid>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={3}>
            <TextField
              id="outlined-helperText"
              label="Venda ou Orçamento"
              value={rowData?.isVendaOS === 0 ? "Orçamento" : "Venda"}
              inputProps={{ readOnly: true }}
            />
          </Grid>
          <Grid item xs={3}>
            <TextField
              id="outlined-helperText"
              label="Situação"
              value={situacao || ""}
              inputProps={{ readOnly: true }}
            />
          </Grid>
          <Grid item xs={3}>
            <TextField
              id="outlined-helperText"
              label="Banco"
              value={filterBancos[0]?.nome || ""}
              inputProps={{ readOnly: true }}
            />
          </Grid>
          <Grid item xs={3}>
            <TextField
              id="outlined-helperText"
              label="Forma de Pagamento"
              value={formaPgto || ""}
              inputProps={{ readOnly: true }}
            />
          </Grid>
          <Grid item xs={3}>
            <TextField
              id="outlined-helperText"
              label="Parcelas"
              value={financeiros[0]?.parcelas || ""}
              inputProps={{ readOnly: true }}
            />
          </Grid>
        </Grid>
        {/* Produtos da Venda */}
        <Typography variant="h6" sx={{ mt: 2, mb: 2 }}>
          Produtos
        </Typography>
        {fields.map((item) => (
          <Box
            key={item.id}
            display="flex"
            alignItems="center"
            gap={2}
            sx={{ mb: 2 }}
          >
            <TextField
              id="outlined-helperText"
              label="Produtos"
              inputProps={{ readOnly: true }}
              value={
                produtos.find((produto) => produto.id === item.idProduto)
                  ?.nome || ""
              }
            />
            <TextField
              id="outlined-helperText"
              label="Quantidade"
              value={item.quantidade || ""}
              inputProps={{ readOnly: true }}
            />
            <TextField
              id="outlined-helperText"
              label="Valor"
              value={financeiros[0]?.valor || ""}
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
