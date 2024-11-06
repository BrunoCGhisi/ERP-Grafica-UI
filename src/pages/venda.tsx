import React, { useState, useEffect } from "react";
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
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { ModalStyle, GridStyle, SpaceStyle } from "../shared/styles";
//Icones
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DoneIcon from "@mui/icons-material/Done";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

import { getToken } from "../shared/services/payload";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useOpenModal } from "../shared/hooks/useOpenModal";
import { ModalRoot } from "../shared/components/ModalRoot";
import { MiniDrawer } from "../shared/components";
import dayjs from "dayjs";
import "./venda.css";

import {
  vendaSchema,
  VendaDataRow,
  vendaSchemaType,
  formaPgtoSchemaType,
  produtoSchemaType,
  bancoSchemaType,
} from "../shared/services/types";
import { getSales, postSale, putSale, deleteSale } from "../shared/services";

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

  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const [sales, setSales] = useState<vendaSchemaType[]>([]);
  const [bancos, setBancos] = useState<bancoSchemaType[]>([]);
  const [clientes, setClientes] = useState<clienteSchemaType[]>([]);
  const [produtos, setProdutos] = useState<produtoSchemaType[]>([]);
  const [formas_pgto, setFormas_pgto] = useState<formaPgtoSchemaType[]>([]);
  const [selectedData, setSelectedData] = useState<VendaDataRow | null>(null);
  const { toggleModal, open } = useOpenModal();
  const [formaPagamento, setFormaPagamento] = useState(0);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    control,
    formState: { errors },
  } = useForm<vendaSchemaType>({
    resolver: zodResolver(vendaSchema),
    defaultValues: {
      vendas_produtos: [{ idProduto: 0, quantidade: 1 }], // Inicializa com um produto
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "vendas_produtos",
  });

  const handleAddProduct = () => {
    append({ idProduto: 0, quantidade: 1 }); // Adiciona um novo produto com quantidade inicial
  };

  const handleRemoveProduct = (index: number) => {
    remove(index);
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
      const response = await axios.get("http://localhost:3000/banco/itens");
      setBancos(response.data);
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

  useEffect(() => {
    if (formaPagamento === 0 || formaPagamento === 1) {
      // Define o valor do campo de parcelas para 1 e torna readOnly
      setValue("parcelas", 1);
    }
  }, [formaPagamento, setValue]);

  //CRUD -----------------------------------------------------------------------------------------------------

  const loadSales = async () => {
    const salesData = await getSales();
    setSales(salesData);
  };
  const handleAdd = async (data: vendaSchemaType) => {
    console.log(data);
    const response = await postSale(data);
    console.log(data);
    if (response.data.info) {
      setAlertMessage(response.data.info);
      setShowAlert(true);
      setTimeout(() => {
        setShowAlert(false);
      }, 5000);
    }
    loadSales();
    setAdOpen(false);
  };

  const handleUpdate = async (data: vendaSchemaType) => {
    const response = await putSale(data);
    if (response.data) {
      setAlertMessage(response.data);
      setShowAlert(true);
      setTimeout(() => {
        setShowAlert(false);
      }, 5000);
    }
    loadSales();
    toggleModal();
  };

  const handleDelete = async (id: number) => {
    await deleteSale(id);
    loadSales();
  };

  useEffect(() => {
    loadSales();
  }, [open]);

  // População da modal  --------------------------------
  const handleEdit = (updateData: VendaDataRow) => {
    setSelectedData(updateData);
    toggleModal();
  };

  useEffect(() => {
    if (selectedData) {
      setValue("id", selectedData.id);
      setValue("idCliente", selectedData.idCliente);
      setValue("idVendedor", selectedData.idVendedor);
      setValue("dataAtual", dayjs(selectedData.dataAtual).format("YYYY-MM-DD")); // Formato ISO
      setValue("isVendaOS", selectedData.isVendaOS);
      setValue("situacao", selectedData.situacao);
      setValue("desconto", selectedData.desconto);
    }
  }, [selectedData, setValue]);

  const [adopen, setAdOpen] = useState<boolean>(false);
  const addOn = () => setAdOpen(true);
  const addOf = () => setAdOpen(false);

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
    { field: "situacao", headerName: "Situacao", editable: false, flex: 0 },
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
          <IconButton onClick={() => row.id !== undefined && handleEdit(row)}>
            <EditIcon />
          </IconButton>
        </div>
      ),
    },
  ];
  const rows = sales.map((venda) => ({
    id: venda.id, // Use the index as a fallback if venda.id is null or undefined
    idCliente: getClientesNames(venda.idCliente),
    idVendedor: venda.idVendedor,
    dataAtual: dayjs(venda.dataAtual).format("DD/MM/YYYY"),
    isVendaOS: venda.isVendaOS,
    situacao: venda.situacao,
    desconto: venda.desconto,
  }));
  useEffect(() => {
    reset();
  }, [clienteSchema, reset]);

  useEffect(() => {
    console.log(showAlert);
  }, [showAlert]);

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
                    defaultValue={true}
                    render={({ field }) => (
                      <Select onChange={field.onChange} value={field.value}>
                        <MenuItem value={true}>Compra</MenuItem>
                        <MenuItem value={false}>OS</MenuItem>
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

                  <Select
                    {...register("idBanco")}
                    labelId="select-label"
                    id="demo-simple-select"
                    label="Banco"
                    error={!!errors.idBanco}
                    defaultValue={bancos.length > 0 ? bancos[0] : "Sem bancos"}
                  >
                    {bancos &&
                      bancos.map((banco) => (
                        <MenuItem key={banco.id} value={banco.id}>
                          {banco.nome}
                        </MenuItem>
                      ))}
                  </Select>

                  <InputLabel>Forma de Pagamento</InputLabel>
                  <Controller
                    name="idForma_pgto"
                    control={control}
                    defaultValue={1}
                    render={({ field }) => (
                      <Select
                        {...field}
                        value={formaPagamento}
                        onChange={(e) => {
                          setFormaPagamento(e.target.value);
                          field.onChange(e);
                        }}
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

                  <Typography>Financeiro</Typography>
                  <TextField
                    label="Parcelas"
                    type="number"
                    defaultValue={1}
                    InputProps={{
                      readOnly: formaPagamento === 0 || formaPagamento === 1,
                    }}
                    {...register("parcelas")}
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
            <Modal
              open={open}
              onClose={toggleModal}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <ModalRoot title="Editar venda">
                <form onSubmit={handleSubmit(handleUpdate)}>
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
                    defaultValue={true}
                    render={({ field }) => (
                      <Select onChange={field.onChange} value={field.value}>
                        <MenuItem value={true}>Compra</MenuItem>
                        <MenuItem value={false}>OS</MenuItem>
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

                  <Select
                    {...register("idBanco")}
                    labelId="select-label"
                    id="demo-simple-select"
                    label="Banco"
                    error={!!errors.idBanco}
                    defaultValue={bancos.length > 0 ? bancos[0] : "Sem bancos"}
                  >
                    {bancos &&
                      bancos.map((banco) => (
                        <MenuItem key={banco.id} value={banco.id}>
                          {banco.nome}
                        </MenuItem>
                      ))}
                  </Select>

                  <InputLabel>Forma de Pagamento</InputLabel>
                  <Controller
                    name="idForma_pgto"
                    control={control}
                    defaultValue={1}
                    render={({ field }) => (
                      <Select
                        {...field}
                        value={formaPagamento}
                        onChange={(e) => {
                          setFormaPagamento(e.target.value);
                          field.onChange(e);
                        }}
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
                            ?.message 
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

                  <Typography>Financeiro</Typography>
                  <TextField
                    label="Parcelas"
                    type="number"
                    defaultValue={1}
                    InputProps={{
                      readOnly: formaPagamento === 0 || formaPagamento === 1,
                    }}
                    {...register("parcelas")}
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
                    Editar
                  </Button>
                </form>
              </ModalRoot>
            </Modal>
          </Box>
          <Box sx={GridStyle}>
            <DataGrid
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
