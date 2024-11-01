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
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useOpenModal } from "../shared/hooks/useOpenModal";
import { ModalRoot } from "../shared/components/ModalRoot";
import { MiniDrawer } from "../shared/components";
import dayjs from "dayjs";
import './venda.css'

import {
  vendaSchema,
  VendaDataRow,
  vendaSchemaType,
  formaPgtoSchemaType,
  produtoSchemaType,
} from "../shared/services/types";
import { getSales, postSale, putSale, deleteSale } from "../shared/services";

const clienteSchema = z.object({
  id: z.number().optional(),
  nome: z.number(),
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

  const dataMui = dayjs(today).format("dd/mm/aaaa")

  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
 
  const [sales, setSales] = useState<vendaSchemaType[]>([]);
  const [clientes, setClientes] = useState<clienteSchemaType[]>([]);
  const [produtos, setProdutos] = useState<produtoSchemaType[]>([]);
  const [formas_pgto, setFormas_pgto] = useState<formaPgtoSchemaType[]>([]);
  const [selectedData, setSelectedData] = useState<VendaDataRow | null>(null);
  const { toggleModal, open } = useOpenModal();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    control,
    formState: { errors },
  } = useForm<vendaSchemaType>({
    resolver: zodResolver(vendaSchema),
  });

  // Trazendo clientes--------------------------------------------------
  useEffect(() => {
    const getClientes = async () => {
      const response = await axios.get("http://localhost:3000/cliente/itens");
      setClientes(response.data);
    };
    getClientes();
  }, []);

  // Trazendo Produtos--------------------------------------------------
  useEffect(() => {
    const getProducts = async () => {
      const response = await axios.get("http://localhost:3000/produto/itens");
      setProdutos(response.data);
    };
    getProducts();
  }, []);

  // Trazendo formas pgto --------------------------------------------------
  useEffect(() => {
    const getPaymentWays= async () => {
      const response = await axios.get("http://localhost:3000/forma_pgto");
      setFormas_pgto(response.data.formas_pgto);
    };
    getPaymentWays();
  }, []);

  //CRUD -----------------------------------------------------------------------------------------------------

  const loadSales = async () => {
    const salesData = await getSales();
    setSales(salesData);
  };
  const handleAdd = async (data: vendaSchemaType) => {
    const response = await postSale(data);
    if (response.data.message){
      setAlertMessage(response.data.message);
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
    if (response.data){
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
    idCliente: venda.idCliente,
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
    console.log(showAlert)
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
                    defaultValue={userId}
                    helperText={errors.idVendedor?.message || "Obrigatório"}
                    error={!!errors.idVendedor}
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

                  <Typography> Venda Produto </Typography>
                  <InputLabel id="demo-simple-select-label">
                    Produtos
                  </InputLabel>
                  <Select
                    {...register("idProduto")}
                    labelId="select-label"
                    id="demo-simple-select"
                    label="idProduto"
                    error={!!errors.idProduto}
                    defaultValue={
                      produtos.length > 0 ? produtos[1].nome : "Sem produtos"
                    }
                  >
                    {produtos &&
                      produtos.map((produto) => (
                        <MenuItem key={produto.id} value={produto.id}>{produto.nome}</MenuItem>
                      ))}
                  </Select>

                  <TextField
                    type="number"
                    id="outlined-helperText"
                    label="Quantidade"
                    helperText={errors.quantidade?.message || "Obrigatório"}
                    error={!!errors.quantidade}
                    defaultValue={0}
                    {...register("quantidade")}
                  />

                  <InputLabel id="demo-simple-select-label">
                    Forma de pagamento
                  </InputLabel>
                  <Select
                    {...register("idForma_pgto")}
                    labelId="select-label"
                    id="demo-simple-select"
                    label="idForma_pgto"
                    error={!!errors.idForma_pgto}
                    defaultValue={
                      formas_pgto.length > 0 ? formas_pgto[1].tipo : "Sem formas_pgto"
                    }
                  >
                    {formas_pgto && formas_pgto.map((forma_pgto) => (
                        <MenuItem key={forma_pgto.id} value={forma_pgto.id}>{forma_pgto.tipo}</MenuItem>
                      ))}
                  </Select>

                  <Typography> Financeiro </Typography>

                  <TextField
                    type="number"
                    id="outlined-helperText"
                    label="N° Parcelas"
                    helperText={errors.parcelas?.message || "Obrigatório"}
                    error={!!errors.parcelas}
                    defaultValue={0}
                    {...register("parcelas")}
                  />

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
            {/* ---------UPDATE----------------------------------------------------------------------------------------------------------- */}
            <Modal
              open={open}
              onClose={toggleModal}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <ModalRoot title="Editar venda">
                <form onSubmit={handleSubmit(handleUpdate)}>
                  <InputLabel id="demo-simple-select-label">
                    Cliente
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
                    defaultValue={dataMui}
                    dataFormatada = {dayjs("dataAtual").format("yyyy-MM-dd")}
                    {...register(dataFormatada)}
                  />
                  <TextField
                    id="outlined-helperText"
                    label="Desconto"
                    defaultValue={0}
                    helperText={errors.desconto?.message || "Obrigatório"}
                    error={!!errors.desconto}
                    {...register("desconto")}
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

      {showAlert && (
        <Alert
        severity="info">{alertMessage}</Alert>
      )      
      }   
    </Box>
  );
};

export default Venda;
