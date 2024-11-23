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
} from "@mui/material";
import { DataGrid, GridColDef, GridRenderCellParams, GridRowParams } from "@mui/x-data-grid";
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
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
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
import { getSales, postSale, deleteSale, getSupplies } from "../../shared/services";
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
  const [idToEdit, setIdToEdit] = useState<any>(null)
  const [sales, setSales] = useState<vendaSchemaType[]>([]);
  const [vp, setVp] = useState<vendaProdutoSchemaType[]>([]);
  const [bancos, setBancos] = useState<bancoSchemaType[]>([]);
  const [financeiros, setFinanceiros] =  useState<financeiroSchemaType[]>([]);
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
    control, watch,
    formState: { errors },
  } = useForm<vendaSchemaType>({
    resolver: zodResolver(vendaSchema),
    defaultValues: {
      vendas_produtos: [{ idProduto: 0, quantidade: 1 }], // Inicializa com um produto
      financeiro: [{ parcelas: 1, idFormaPgto: 1}], 
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
            ); if (!produto) return acc;
  
            const insumos = response.filter(
              (insumo: insumoSchemaType) => insumo.id === produto.idInsumo
            );
            console.log(produto.comprimento)
            const insumoVal = insumos.reduce(
              (accInsumo: number, insumo: insumoSchemaType) => {
                const area = produto.comprimento && produto.largura
                  ? ((produto.comprimento / 100) * (produto.largura / 100)) + 23
                  : 0;

                const valorM2 = insumo.valorM2 || 0;
                return accInsumo + (valorM2 * area);
              },
              0
            );
            return acc + insumoVal * (Number(item?.quantidade) || 0);
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
   setSelectedRow(params)
   toggleGetModal.toggleModal()
   console.log(financeiros)
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

  const situacaoNome = (situacaoData: number | undefined) =>{
    
    switch (situacaoData) {
        case 0:
            return "Em espera";
            break;
        case 2:
            return "Em execução"
            break;
        case 3:
            return "Em acabamento"
            break;
        case 4:
            return "Finalizado"
            break;
        case 1:
            return "Em criação (arte)"
            break;
        case 5:
            return "Entregue"
            break;
    }
  }


  // GRID ------------------------------------------------

  const columns: GridColDef<VendaDataRow>[] = [
    { field: "id", headerName: "id", editable: false, flex: 0 },
    {
      field: "idCliente",
      headerName: "IdCliente",
      editable: false,
      flex: 0,
    },
    { field: "idVendedor", headerName: "IdVendedor", editable: false, flex: 0 },
    { field: "dataAtual", headerName: "DataAtual", editable: false, flex: 0 },
    { field: "isVendaOS", headerName: "IsVendaOS", editable: false, flex: 0 },
    { field: "situacao", headerName: "Situacao", editable: false, flex: 0, renderCell: (params) => <span>{situacaoNome(params.value)}</span>, },
    { field: "desconto", headerName: "Desconto", editable: false, flex: 0 },
    {
      field: "acoes",
      headerName: "Ações",
      width: 150,
      align: "center",
      type: "actions",
      flex: 0,
      renderCell: ({ row }) => (
        <div>

          <IconButton
            onClick={() => row.id !== undefined && handleDelete(row.id)}
          >
            <DeleteIcon />
          </IconButton>
          <IconButton onClick={() => row.id !== undefined && [setIdToEdit(row.id), toggleModal()]}>
            <EditIcon />
          </IconButton>
          <IconButton onClick={() => handleRowClick(row)}>
            <OpenInNewIcon />
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
    isVendaOS: venda.isVendaOS == 0 ?  "Venda" : "Orçamento",
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



  return (
    <Box>
      
      
      <MiniDrawer>
      
        <Box sx={SpaceStyle}>
        
          <Box>
            

            <Stack direction="row" spacing={2}>
              <Button
                onClick={addOn}
                variant="outlined"
                startIcon={<AddCircleOutlineIcon />}
              >
                Adicionar
              </Button>
            </Stack>

            <Modal
              open={adopen}
              onClose={addOf}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Box sx={ModalStyle}>
                <Typography id="modal-modal-title" variant="h6" component="h2">
                  Nova Venda
                </Typography>

                <form onSubmit={handleSubmit(handleAdd)}>
                  <TextField
                    id="outlined-helperText"
                    label="Vendedor"
                    inputProps={{ readOnly: true }}
                    helperText={errors.idVendedor?.message || "Obrigatório"}
                    error={!!errors.idVendedor}
                    defaultValue={userId}
                    {...register("idVendedor")}
                  />

                  <InputLabel id="demo-simple-select-label">
                    Clientes
                  </InputLabel>
                  <Select
                    {...register("idCliente")}
                    labelId="select-label"
                    id="demo-simple-select"
                    label="idCliente"
                    error={!!errors.idCliente}
                    defaultValue={
                      clientes.length > 0 ? clientes[0].nome : "Sem clientes"
                    }
                  >
                    {clientes &&
                      clientes.map((cliente) => (
                        <MenuItem key={cliente.id} value={cliente.id}>
                          {cliente.nome}
                        </MenuItem>
                      ))}
                  </Select>

                  <TextField
                    type="date"
                    id="outlined-helperText"
                    label={"Data compra"}
                    InputLabelProps={{ shrink: true }}
                    helperText={errors.dataAtual?.message || "Obrigatório"}
                    error={!!errors.dataAtual}
                    defaultValue={dayjs(today).format("YYYY-MM-DD")}
                    {...register("dataAtual")}
                  />
                  <TextField
                    id="outlined-helperText"
                    label="Desconto"
                    defaultValue={0}
                    helperText={errors.desconto?.message || "Obrigatório"}
                    error={!!errors.desconto}
                    {...register("desconto", { valueAsNumber: true })}
                  />

                  <Controller
                    control={control}
                    name="isVendaOS"
                    defaultValue={1}
                    render={({ field }) => (
                      <Select onChange={field.onChange} value={field.value}>
                        <MenuItem value={0}>Venda</MenuItem>
                        <MenuItem value={1}>Orçamento</MenuItem>
                      </Select>
                    )}
                  />

                  <Controller
                    control={control}
                    name="situacao"
                    defaultValue={0}
                    render={({ field }) => (
                      <Select onChange={field.onChange} value={field.value}>
                        <MenuItem value={0}>Em espera</MenuItem>
                        <MenuItem value={1}>Em criação (arte)</MenuItem>
                        <MenuItem value={2}>Em execução</MenuItem>
                        <MenuItem value={3}>Em acabamento</MenuItem>
                        <MenuItem value={4}>Finalizado</MenuItem>
                        <MenuItem value={5}>Entregue</MenuItem>
                      </Select>
                    )}
                  />

                  <InputLabel id="demo-simple-select-label">Banco</InputLabel>

                  <Controller
                    name={`financeiro.0.idBanco`}
                    control={control}
                    render={({ field }) => (
                      <Select
                        {...field}
                        value={field.value || ""} // Valor padrão do idBanco
                        onChange={(e) => field.onChange(e.target.value)}
                        style={{ width: 300 }}
                      >
                        {bancos?.map((banco) => (
                          <MenuItem key={banco.id} value={banco.id}>
                            {banco.nome}
                          </MenuItem>
                        ))}
                      </Select>
                    )}/>


                  <InputLabel>Forma de Pagamento</InputLabel>
                  <Controller
                    name={`financeiro.0.idFormaPgto`}
                    control={control}
                    render={({ field }) => (
                      <Select
                        {...field}
                        value={field.value || ""} // Valor padrão do idForma_pgto
                        onChange={(e) => field.onChange(e.target.value)}
                        style={{ width: 300 }}
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


                  <Typography variant="h6">Produtos da Venda</Typography>
                  {fields.map((item, index) => (
                    <Box
                      key={item.id}
                      display="flex"
                      alignItems="center"
                      gap={2}
                    >
                      <Controller
                        control={control}
                        name={`vendas_produtos.${index}.idProduto` as const}
                        defaultValue={0}
                        render={({ field }) => (
                          <Select
                            {...field}
                            error={!!errors.vendas_produtos?.[index]?.idProduto}
                          >
                            {produtos.map((produto) => (
                              <MenuItem key={produto.id} value={produto.id}>
                                {produto.nome}
                              </MenuItem>
                            ))}
                          </Select>
                        )}
                      />

                      <TextField
                        {...register(
                          `vendas_produtos.${index}.quantidade` as const
                        )}
                        type="number"
                        error={!!errors.vendas_produtos?.[index]?.quantidade}
                        helperText={
                          errors.vendas_produtos?.[index]?.quantidade
                            ?.message || "Quantidade"
                        }
                        label="Quantidade"
                        defaultValue={1}
                        InputProps={{ inputProps: { min: 1 } }}
                      />
                                          

                      <IconButton
                        onClick={() => handleRemoveProduct(index)}
                        color="error"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  ))}

                    <Box mt={2}>
                    <Typography variant="h6">Valor</Typography>
                      <TextField
                        placeholder={`Valor bruto: ${totalQuantidade}`}
                        
                        {...register('financeiro.0.valor')}
                        variant="outlined"
                        fullWidth
                      />
                    </Box>  

                <Typography>Financeiro</Typography>
                  <TextField
                    label="Parcelas"
                    type="number"
                    defaultValue={1}
                    InputProps={{
                      readOnly: waiter === 2 || waiter === 1 || waiter === 4,
                    }}
                    {...register("financeiro.0.parcelas")}
                  />

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
                  >
                    Cadastrar
                  </Button>
                </form>
              </Box>
            </Modal>
            {/* ------------------UPDATE---------------------------------------------------------------------------- */}
            {
              open &&  (
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
                  loadSales = {loadSales}
                />
              )
            }
            { toggleGetModal.open && (
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
              loading
              rows={rows}
              columns={columns}
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
