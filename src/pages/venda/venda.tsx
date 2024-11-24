import { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  InputLabel,
  Select,
  MenuItem,
  Modal,
  Button,
  Stack,
  TextField,
  Typography,
  IconButton,
  Alert,
  Grid,
  InputAdornment,
} from "@mui/material";
import {
  DataGrid,
  GridColDef,
  GridRenderCellParams,
  GridRowParams,
  GridLocaleText,
  
} from "@mui/x-data-grid";


import { ModalStyle, GridStyle, SpaceStyle } from "../../shared/styles";
//Icones
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DoneIcon from "@mui/icons-material/Done";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { getToken } from "../../shared/services/payload";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useOpenModal } from "../../shared/hooks/useOpenModal";
import { MiniDrawer } from "../../shared/components";
import dayjs from "dayjs";
import "../venda.css";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import {
  vendaSchema,
  VendaDataRow,
  vendaSchemaType,
  produtoSchemaType,
  bancoSchemaType,
  vendaProdutoSchemaType,
  financeiroSchemaType,
  insumoSchemaType,
} from "../../shared/services/types";
import {
  getSales,
  postSale,
  deleteSale,
  getSupplies,
} from "../../shared/services";
import { ModalEditVenda } from "./components/modal-edit-venda";
import { ModalGetVenda } from "./components/modal-get-venda";
import CircularProgress from "@mui/material/CircularProgress";

const clienteSchema = z.object({
  id: z.number().optional(),
  nome: z.string(),
});
type clienteSchemaType = z.infer<typeof clienteSchema>;

const Venda = () => {
  const [userId, setUserId] = useState<number | null>(null); // Estado para armazenar o userId
  useEffect(() => {
    const fetchToken = async () => {
      const tokenData = await getToken();
      if (tokenData) {
        setUserId(tokenData.userId);
      }
    };

    fetchToken();
  }, []);

  const today = new Date();
  const [selectedRow, setSelectedRow] = useState<VendaDataRow>();
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [idToEdit, setIdToEdit] = useState<any>(null);
  const [sales, setSales] = useState<vendaSchemaType[]>([]);
  const [vp, setVp] = useState<vendaProdutoSchemaType[]>([]);
  const [bancos, setBancos] = useState<bancoSchemaType[]>([]);
  const [financeiros, setFinanceiros] = useState<financeiroSchemaType[]>([]);
  const [clientes, setClientes] = useState<clienteSchemaType[]>([]);
  const [produtos, setProdutos] = useState<produtoSchemaType[]>([]);
  const { toggleModal, open } = useOpenModal();
  const toggleGetModal = useOpenModal();
  const [totalQuantidade, setTotalQuantidade] = useState(0);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    control,
    watch,
    formState: { errors },
  } = useForm<vendaSchemaType>({
    resolver: zodResolver(vendaSchema),
    defaultValues: {
      vendas_produtos: [{ idProduto: 0, quantidade: 1 }], // Inicializa com um produto
      financeiro: [{ parcelas: 1, idFormaPgto: 1 }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "vendas_produtos",
  });

  useEffect(() => {
    const PriceSugestion = async () => {
      try {
        const response = await getSupplies();
        const subscription = watch((values) => {
          const sum = values.vendas_produtos?.reduce((acc, item) => {
            const produto = produtos.find(
              (produto: produtoSchemaType) => produto.id === item?.idProduto
            );
            if (!produto) return acc;

            const insumos = response.filter(
              (insumo: insumoSchemaType) => insumo.id === produto.idInsumo
            );
          
            const insumoVal = insumos.reduce(
              (accInsumo: number, insumo: insumoSchemaType) => {
                const area = produto.comprimento && produto.largura
                  ? ((produto.comprimento / 100) * (produto.largura / 100))
                  : 0;

                const valorM2 = insumo.valorM2 || 0;
                console.log("AREA", valorM2 * area)
                console.log("ACC", accInsumo)
                console.log("InsumosVAl",accInsumo + ((valorM2 * area)))
                return accInsumo + ((valorM2 * area));
                
              },
              0
            );
            console.log("InsumosVAl 2", insumoVal)
            console.log("ItemQuantifafe 2", insumoVal)
            console.log(insumoVal * (Number(item?.quantidade))+ 23)
            return acc + (insumoVal * (Number(item?.quantidade))+ 23 || 0);
          }, 0);
          setTotalQuantidade(Number(sum?.toFixed(2)) || 0);
        });
        return () => subscription.unsubscribe();
      } catch (error) {
        console.error("Erro ao buscar insumos ou calcular valores:", error);
      }
    };

    PriceSugestion();
  }, [watch, getSupplies]);

  const handleAddProduct = () => {
    append({ idProduto: 0, quantidade: 1 }); // Adiciona um novo produto com quantidade inicial
  };

  const handleRemoveProduct = (index: number) => {
    remove(index);
  };

  const handleRowClick = (params: VendaDataRow) => {
    setSelectedRow(params);
    toggleGetModal.toggleModal();
  };

  // Trazendo clientes--------------------------------------------------
  useEffect(() => {
    const getClientes = async () => {
      const response = await axios.get("http://localhost:3000/cliente/itens");
      setClientes(response.data);
    };
    getClientes();
  }, []);

  const getClientesNames = (id: number | undefined) => {
    const clienteNome = clientes.find((cat) => cat.id === id);
    return clienteNome ? clienteNome.nome : "Desconhecido";
  };

  // Trazendo bancos--------------------------------------------------
  useEffect(() => {
    const getBancos = async () => {
      const response = await axios.get("http://localhost:3000/banco");
      setBancos(response.data.getBancos);
    };
    getBancos();
  }, []);

  // Trazendo Produtos    --------------------------------------------------
  useEffect(() => {
    const getProducts = async () => {
      const response = await axios.get("http://localhost:3000/produto/itens");
      setProdutos(response.data);
    };
    getProducts();
  }, []);

  //CRUD -----------------------------------------------------------------------------------------------------

  const loadSales = async () => {
    const response = await axios.get("http://localhost:3000/venda");
    const responseFin = await axios.get("http://localhost:3000/financeiro");
    setVp(response.data.vendasProdutos);
    setFinanceiros(responseFin.data);

    const salesData = await getSales();
    setSales(salesData);
  };
  const handleAdd = async (data: vendaSchemaType) => {
    const response = await postSale(data);

    if (response.data.info) {
      setAlertMessage(response.data.info);
      setShowAlert(true);
      setTimeout(() => {
        setShowAlert(false);
      }, 5000);
    }
    loadSales();
    reset();

    setAdOpen(false);
  };

  const handleDelete = async (id: number) => {
    await deleteSale(id);
    loadSales();
  };

  useEffect(() => {
    loadSales();
  }, [open]);

  const [adopen, setAdOpen] = useState<boolean>(false);
  const addOn = () => setAdOpen(true);
  const addOf = () => setAdOpen(false);

  const situacaoNome = (situacaoData: number | undefined) => {
    switch (situacaoData) {
      case 0:
        return "Em espera";
        break;
      case 2:
        return "Em execução";
        break;
      case 3:
        return "Em acabamento";
        break;
      case 4:
        return "Finalizado";
        break;
      case 1:
        return "Em criação (arte)";
        break;
      case 5:
        return "Entregue";
        break;
    }
  };

  // GRID ------------------------------------------------

  const columns: GridColDef<VendaDataRow>[] = [
    {
      field: "idCliente",
      headerName: "Cliente",
      editable: false,
      flex: 0,
      width: 250,
      headerClassName: "gridHeader--header",
    },
    {
      field: "idVendedor",
      headerName: "Vendedor",
      editable: false,
      flex: 0,
      width: 250,
      headerClassName: "gridHeader--header",
    },
    {
      field: "dataAtual",
      headerName: "Data Cadastro",
      editable: false,
      flex: 0,
      width: 120,
      headerClassName: "gridHeader--header",
    },
    {
      field: "isVendaOS",
      headerName: "OS",
      editable: false,
      flex: 0,
      width: 100,
      headerClassName: "gridHeader--header",
    },
    {
      field: "situacao",
      headerName: "Situacao",
      editable: false,
      flex: 0,
      width: 100,
      headerClassName: "gridHeader--header",
      renderCell: (params) => <span>{situacaoNome(params.value)}</span>,
    },
    {
      field: "desconto",
      headerName: "Desconto",
      editable: false,
      flex: 0,
      width: 80,
      headerClassName: "gridHeader--header",
      renderCell: (params) => (
        <span>{params.value != null ? `${params.value}%` : "N/A"}</span>
      ),
    },
    {
      field: "acoes",
      headerName: "Ações",
      width: 150,
      align: "center",
      type: "actions",
      flex: 0,
      headerClassName: "gridHeader--header",
      renderCell: ({ row }) => (
        <div>
          <IconButton
            onClick={() => row.id !== undefined && handleDelete(row.id)}
          >
            <DeleteIcon />
          </IconButton>
          <IconButton
            onClick={() =>
              row.id !== undefined && [setIdToEdit(row.id), toggleModal()]
            }
          >
            <EditIcon />
          </IconButton>
          <IconButton onClick={() => handleRowClick(row)}>
            <OpenInNewIcon color="primary" />
          </IconButton>
        </div>
      ),
    },
  ];
  const rows = sales.map((venda) => ({
    id: venda.id,
    idCliente: getClientesNames(venda.idCliente),
    idVendedor: venda.idVendedor,
    dataAtual: dayjs(venda.dataAtual).format("DD/MM/YYYY"),
    isVendaOS: venda.isVendaOS == 0 ? "Venda" : "Orçamento",
    situacao: venda.situacao,
    desconto: venda.desconto,
  }));
  useEffect(() => {
    reset();
  }, [clienteSchema, reset]);

  useEffect(() => {
    console.log(showAlert);
  }, [showAlert]);

  const waiter = watch("financeiro.0.idFormaPgto");
  useEffect(() => {
    if (waiter === 0 || waiter === 1 || waiter === 4) {
      setValue("financeiro.0.parcelas", 1); // Atualiza o valor de parcelas
    }
  }, [waiter, setValue]);

  const localeText: Partial<GridLocaleText> = {
    toolbarDensity: "Densidade",
    toolbarColumns: "Colunas",
    footerRowSelected: (count) => "", // Remove a mensagem "One row selected"
  };

  return (
    <Box>
      <MiniDrawer>
        <Box sx={SpaceStyle}>
        <Grid
            container
            spacing={2}
            justifyContent="space-between"
            alignItems="center"
          >
            <Grid item>
              <Typography variant="h6">Vendas</Typography>
            </Grid>

            <Grid item>
              <Button
                onClick={addOn}
                variant="outlined"
                startIcon={<AddCircleOutlineIcon />}
              >
                Cadastrar
              </Button>
            </Grid>
          </Grid>
          <Box>

            <Modal
              open={adopen}
              onClose={addOf}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Box sx={{ ...ModalStyle, width: "80%", height: "80vh" }}>
                <Typography id="modal-modal-title" variant="h6" component="h2">
                  Nova Venda
                </Typography>

                <form onSubmit={handleSubmit(handleAdd)}>
                  <Grid container spacing={2}>
                    <Grid item xs={8}>
                      {/* Primeira coluna */}
                      <Grid container spacing={2}>
                        <Grid item xs={6}>
                          <InputLabel>Vendedor</InputLabel>
                          <TextField
                            fullWidth
                            id="outlined-helperText"
                            inputProps={{ readOnly: true }}
                            error={!!errors.idVendedor}
                            defaultValue={userId}
                            {...register("idVendedor")}
                          />
                        </Grid>
                        <Grid item xs={6}>
                          <InputLabel>Cliente </InputLabel>
                          <Select
                            fullWidth
                            {...register("idCliente")}
                            labelId="select-label"
                            id="demo-simple-select"
                            label="idCliente"
                            error={!!errors.idCliente}
                            defaultValue={
                              clientes.length > 0
                                ? clientes[0].nome
                                : "Sem clientes"
                            }
                          >
                            {clientes &&
                              clientes.map((cliente) => (
                                <MenuItem key={cliente.id} value={cliente.id}>
                                  {cliente.nome}
                                </MenuItem>
                              ))}
                          </Select>
                        </Grid>
                      </Grid>
                      <Grid container spacing={1} sx={{ mt: 1 }}>
                        <Grid item xs={3}>
                          <InputLabel>Data da Compra</InputLabel>
                          <TextField
                            fullWidth
                            type="date"
                            id="outlined-helperText"
                            InputLabelProps={{ shrink: true }}
                            helperText={
                              errors.dataAtual?.message || "Obrigatório"
                            }
                            error={!!errors.dataAtual}
                            defaultValue={dayjs(today).format("YYYY-MM-DD")}
                            {...register("dataAtual")}
                          />
                        </Grid>

                        <Grid item xs={3}>
                          <InputLabel>Tipo</InputLabel>
                          <Controller
                            control={control}
                            name="isVendaOS"
                            defaultValue={1}
                            render={({ field }) => (
                              <Select
                                fullWidth
                                onChange={field.onChange}
                                value={field.value}
                              >
                                <MenuItem value={0}>Venda</MenuItem>
                                <MenuItem value={1}>Orçamento</MenuItem>
                              </Select>
                            )}
                          />
                        </Grid>
                        <Grid item xs={3}>
                          <InputLabel>Situação</InputLabel>
                          <Controller
                            control={control}
                            name="situacao"
                            defaultValue={0}
                            render={({ field }) => (
                              <Select
                                fullWidth
                                onChange={field.onChange}
                                value={field.value}
                              >
                                <MenuItem value={0}>Em espera</MenuItem>
                                <MenuItem value={1}>Em criação (arte)</MenuItem>
                                <MenuItem value={2}>Em execução</MenuItem>
                                <MenuItem value={3}>Em acabamento</MenuItem>
                                <MenuItem value={4}>Finalizado</MenuItem>
                                <MenuItem value={5}>Entregue</MenuItem>
                              </Select>
                            )}
                          />
                        </Grid>
                        <Grid item xs={3}>
                          <TextField
                            fullWidth
                            id="outlined-helperText"
                            label="Desconto"
                            defaultValue={0}
                            sx={{ mt: 3 }}
                            InputProps={{
                              endAdornment: (
                                <InputAdornment position="start">
                                  %
                                </InputAdornment>
                              ),
                            }}
                            helperText={
                              errors.desconto?.message || "Obrigatório"
                            }
                            error={!!errors.desconto}
                            {...register("desconto", { valueAsNumber: true })}
                          />
                        </Grid>
                      </Grid>
                      <Grid container spacing={2}>
                        <Grid item xs={6}>
                          <InputLabel id="demo-simple-select-label">
                            Banco
                          </InputLabel>
                          <Controller
                            name={`financeiro.0.idBanco`}
                            control={control}
                            render={({ field }) => (
                              <Select
                                fullWidth
                                {...field}
                                value={field.value || ""} // Valor padrão do idBanco
                                onChange={(e) => field.onChange(e.target.value)}
                              >
                                {bancos?.map((banco) => (
                                  <MenuItem key={banco.id} value={banco.id}>
                                    {banco.nome}
                                  </MenuItem>
                                ))}
                              </Select>
                            )}
                          />
                        </Grid>
                        <Grid item xs={6}>
                          <InputLabel>Forma de Pagamento</InputLabel>
                          <Controller
                            name={`financeiro.0.idFormaPgto`}
                            control={control}
                            render={({ field }) => (
                              <Select
                                fullWidth
                                {...field}
                                value={field.value || ""} // Valor padrão do idForma_pgto
                                onChange={(e) => field.onChange(e.target.value)}
                              >
                                <MenuItem value={1}>Dinheiro</MenuItem>
                                <MenuItem value={2}>Débito</MenuItem>
                                <MenuItem value={3}>Crédito</MenuItem>
                                <MenuItem value={4}>Pix</MenuItem>
                                <MenuItem value={5}>Boleto</MenuItem>
                                <MenuItem value={6}>À prazo</MenuItem>
                                <MenuItem value={7}>Cheque</MenuItem>
                              </Select>
                            )}
                          />
                        </Grid>
                      </Grid>
                      <Grid container spacing={2} sx={{ marginTop: 1 }}>
                        <Grid item xs={6}>
                          <TextField
                            fullWidth
                            label="Parcelas"
                            type="number"
                            defaultValue={1}
                            InputProps={{
                              readOnly:
                                waiter === 2 || waiter === 1 || waiter === 4,
                            }}
                            {...register("financeiro.0.parcelas")}
                          />
                        </Grid>

                        <Grid item xs={6}>
                          <TextField
                            placeholder={`Valor bruto: ${totalQuantidade}`}
                            {...register("financeiro.0.valor")}
                            variant="outlined"
                            fullWidth
                          />
                        </Grid>
                      </Grid>
                    </Grid>
                    {/* Segunda coluna */}
                    <Grid item xs={4}>
                      <Grid item xs={12}>
                        {fields.map((item, index) => (
                          <Box
                            key={item.id}
                            display="flex"
                            flexDirection="column" // Alterado para 'column' para separar o Select da quantidade + delete
                            gap={2}
                          >
                            <Grid container spacing={2}>
                              {/* Select ocupando a linha inteira */}
                              <Grid item xs={12}>
                                <InputLabel id={`produto-label-${index}`}>
                                  Produto
                                </InputLabel>
                                <Controller
                                  control={control}
                                  name={
                                    `vendas_produtos.${index}.idProduto` as const
                                  }
                                  defaultValue={0}
                                  render={({ field }) => (
                                    <Select
                                      fullWidth
                                      {...field}
                                      error={
                                        !!errors.vendas_produtos?.[index]
                                          ?.idProduto
                                      }
                                    >
                                      {produtos.map((produto) => (
                                        <MenuItem
                                          key={produto.id}
                                          value={produto.id}
                                        >
                                          {produto.nome}
                                        </MenuItem>
                                      ))}
                                    </Select>
                                  )}
                                />
                              </Grid>
                            </Grid>

                            {/* Quantidade e Ícone de Delete lado a lado */}
                            <Grid container spacing={2} sx={{ mt: 1 }}>
                              <Grid item xs={10}>
                                <TextField
                                  {...register(
                                    `vendas_produtos.${index}.quantidade` as const
                                  )}
                                  type="number"
                                  error={
                                    !!errors.vendas_produtos?.[index]
                                      ?.quantidade
                                  }
                                  label="Quantidade"
                                  fullWidth
                                  defaultValue={1}
                                  InputProps={{ inputProps: { min: 1 } }}
                                  sx={{ mb: 1 }}
                                />
                              </Grid>
                              <Grid item xs={2}>
                                <IconButton
                                  onClick={() => handleRemoveProduct(index)}
                                  color="primary"
                                  sx={{ mt: 1 }}
                                >
                                  <DeleteIcon />
                                </IconButton>
                              </Grid>
                            </Grid>
                          </Box>
                        ))}
                      </Grid>
                    </Grid>

                    <Grid item xs={12} sx={{ textAlign: "right", mt: 2 }}>
                      <Button
                        variant="outlined"
                        startIcon={<AddCircleOutlineIcon />}
                        onClick={handleAddProduct}
                      >
                        Adicionar Produto
                      </Button>

                      <Button
                        type="submit"
                        variant="outlined"
                        startIcon={<DoneIcon />}
                        sx={{ ml: 2 }}
                      >
                        Cadastrar
                      </Button>
                    </Grid>
                  </Grid>
                </form>
              </Box>
            </Modal>
            {/* ------------------UPDATE---------------------------------------------------------------------------- */}
            {open && (
              <ModalEditVenda
                clientes={clientes}
                bancos={bancos}
                open={open}
                produtos={produtos}
                setAlertMessage={setAlertMessage}
                setShowAlert={setShowAlert}
                toggleModal={toggleModal}
                userId={userId}
                idToEdit={idToEdit}
                vendas={sales}
                vendasProdutos={vp}
                financeiro={financeiros}
                loadSales={loadSales}
              />
            )}
            {toggleGetModal.open && (
              <ModalGetVenda
                vendasProdutos={vp}
                produtos={produtos}
                financeiro={financeiros}
                vendas={sales}
                clientes={clientes}
                rowData={selectedRow}
                open={toggleGetModal.open}
                toggleModal={toggleGetModal.toggleModal}
              />
            )}
          </Box>

          <Box sx={GridStyle}>
            <DataGrid
              rows={rows}
              columns={columns}
              localeText={localeText}
              initialState={{
                pagination: {
                  paginationModel: {
                    pageSize: 6,
                  },
                },
              }}
              pageSizeOptions={[6]}
            />
          </Box>
        </Box>
      </MiniDrawer>

      {showAlert && <Alert severity="info">{alertMessage}</Alert>}
    </Box>
  );
};

export default Venda;
