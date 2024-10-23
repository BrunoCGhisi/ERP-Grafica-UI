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
} from "@mui/material";
import { DataGrid,GridColDef } from "@mui/x-data-grid";
import { ModalStyle, GridStyle, SpaceStyle } from "../shared/styles";
//Icones
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DoneIcon from "@mui/icons-material/Done";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

import { getToken } from "../shared/services/payload";
import {useForm, Controller } from "react-hook-form";
import { z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {useOpenModal} from "../shared/hooks/useOpenModal";
import { ModalRoot } from "../shared/components/ModalRoot";
import { MiniDrawer } from "../shared/components";
import dayjs from "dayjs";

import { vendaSchema, VendaDataRow, vendaSchemaType } from "../shared/services/types";
import { getSales, postSale, putSale, deleteSale } from "../shared/services";


const clienteSchema = z.object({
  id: z.number().optional(),
  nome: z.number()
})
type clienteSchemaType = z.infer<typeof clienteSchema>

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
  const formatDate = (dateString: string) => {
    const date = new Date(dateString); 
    if (isNaN(date.getTime())) {
      return 'Invalid Date';
    }
    return date.toLocaleDateString('pt-BR'); 
  };
  const [sales, setSales] = useState<vendaSchemaType[]>([]);
  const [clientes, setClientes] = useState<clienteSchemaType[]>([]);
  const [selectedData, setSelectedData] = useState<VendaDataRow | null>(null);
  const {toggleModal, open} = useOpenModal();

  const {register, handleSubmit, reset, setValue, control, formState: {errors}} = useForm<vendaSchemaType>({
    resolver: zodResolver(vendaSchema)
  });

// Trazendo clientes--------------------------------------------------  
  useEffect(() => {
    const getClientes = async() => {
      const response = await axios.get("http://localhost:3000/cliente/itens");
      setClientes(response.data);
    };
    getClientes();
  },[]);


  //CRUD -----------------------------------------------------------------------------------------------------

  const loadSales = async () => {
    const salesData = await getSales();
    setSales(salesData) 
  };

  const handleAdd = async (data: vendaSchemaType) => {
    await postSale(data);
    loadSales();
    setAdOpen(false);
  };

  const handleUpdate = async (data: vendaSchemaType) => {
    await putSale(data);
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
  //-MODAIS-----------------------------------------------------------------------------------------------------------------------


// População da modal  --------------------------------
const handleEdit = (updateData: VendaDataRow) => {
  setSelectedData(updateData)
  toggleModal()
} 

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
          <IconButton onClick={() => row.id !== undefined && handleDelete(row.id)}>
            <DeleteIcon />
          </IconButton>
          <IconButton
            onClick={() => row.id !== undefined && handleEdit(row)}>
            <EditIcon />
          </IconButton>
        </div>
      ),
    },
  ];

  const rows = sales.map((venda, index) => ({
    id: venda.id ?? index, // Use the index as a fallback if venda.id is null or undefined
    idCliente: venda.idCliente,
    idVendedor: venda.idVendedor,
    dataAtual: formatDate(venda.dataAtual),
    isVendaOS: venda.isVendaOS,
    situacao: venda.situacao,
    desconto: venda.desconto,
  }));
  useEffect(() => {
    reset()
  }, [clienteSchema, reset])



  return (
    <Box>
      <MiniDrawer />
      <Box sx={SpaceStyle}>
        <Typography>estamos dentro das vendas</Typography>
        <Typography>(Não somos uma venda)</Typography>
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
                {...register('idVendedor')}
              />

              <InputLabel id="demo-simple-select-label">Clientes</InputLabel>
              <Select
                {...register('idCliente')}
                labelId="select-label"
                id="demo-simple-select"
                label="idCliente"
                error={!!errors.idCliente}
                defaultValue={clientes.length > 0 ? clientes[0].nome : "Sem clientes"}>
                  {clientes && clientes.map((cliente) => (
                    
                    <MenuItem value={cliente.id}>{cliente.nome}</MenuItem>))}
              </Select>



              <TextField
                type="date"
                id="outlined-helperText"
                label={"Data compra"}
                InputLabelProps={{ shrink: true } }
                helperText={errors.dataAtual?.message || "Obrigatório"}
                error={!!errors.dataAtual}
                defaultValue={dayjs(today).format("YYYY-MM-DD")}
                {...register('dataAtual')}
              />
              <TextField
                id="outlined-helperText"
                label="Desconto"
                defaultValue={0}
                helperText={errors.desconto?.message || "Obrigatório"}
                error={!!errors.desconto}
                {...register('desconto', { valueAsNumber: true })}
              />


              <Controller
                control={control}
                name="isVendaOS"
                defaultValue={true}
                render={({field}) =>(
                  <Select
                  onChange={field.onChange}
                  value={field.value}
                >
                    <MenuItem value={true}>Compra</MenuItem>
                    <MenuItem value={false}>OS</MenuItem>
                  </Select>)}
              />

              <Controller
                control={control}
                name="situacao"
                defaultValue={0}
                render={({field}) =>(
                  <Select
                  onChange={field.onChange}
                  value={field.value}
                >
                    <MenuItem value={0}>Em espera</MenuItem>
                    <MenuItem value={1}>Em criação (arte)</MenuItem>
                    <MenuItem value={2}>Em execução</MenuItem>
                    <MenuItem value={3}>Em acabamento</MenuItem>
                    <MenuItem value={4}>Finalizado</MenuItem>
                    <MenuItem value={5}>Entregue</MenuItem>
                  </Select>)}
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

          <Modal
            open={open}
            onClose={toggleModal}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
           <ModalRoot title="Editar venda">

           <form onSubmit={handleSubmit(handleUpdate)}>
              <InputLabel id="demo-simple-select-label">Categorias</InputLabel>
              <Select
                {...register('idCliente')}
                labelId="select-label"
                id="demo-simple-select"
                label="idCliente"
                error={!!errors.idCliente}
                defaultValue={clientes.length > 0 ? clientes[0].nome : "Sem clientes"}>
                  {clientes && clientes.map((cliente) => (
                    
                    <MenuItem value={cliente.id}>{cliente.nome}</MenuItem>))}
              </Select>


              <TextField
                type="date"
                id="outlined-helperText"
                label={"Data compra"}
                InputLabelProps={{ shrink: true } }
                helperText={errors.dataAtual?.message || "Obrigatório"}
                error={!!errors.dataAtual}
                defaultValue={dayjs(today).format("YYYY-MM-DD")}
                {...register('dataAtual')}
              />
              <TextField
                id="outlined-helperText"
                label="Desconto"
                defaultValue={0}
                helperText={errors.desconto?.message || "Obrigatório"}
                error={!!errors.desconto}
                {...register('desconto')}
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
                render={({field}) =>(
                  <Select
                  onChange={field.onChange}
                  value={field.value}
                >
                    <MenuItem value={0}>Em espera</MenuItem>
                    <MenuItem value={1}>Em criação (arte)</MenuItem>
                    <MenuItem value={2}>Em execução</MenuItem>
                    <MenuItem value={3}>Em acabamento</MenuItem>
                    <MenuItem value={4}>Finalizado</MenuItem>
                    <MenuItem value={5}>Entregue</MenuItem>
                  </Select>)}
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
            getRowId={(row) => row.id ?? row.idCliente}
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
    </Box>
  );
};

export default Venda;
