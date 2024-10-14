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


import {useForm, Controller } from "react-hook-form";
import { z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {useOpenModal} from "../shared/hooks/useOpenModal";
import { ModalRoot } from "../shared/components/ModalRoot";
import { MiniDrawer } from "../shared/components";
import dayjs from "dayjs";

const vendaSchema = z.object({
  id: z.number().optional(),
  idCliente: z.number(),
  idVendedor: z.number(),
  data: z.string(),
  isVendaOS: z.boolean(),
  situacao : z.number(),  
  desconto  : z.number().optional(), 
})

type vendaSchemaType = z.infer<typeof vendaSchema>

const clienteSchema = z.object({
  id: z.number().optional(),
  nome: z.number()
})
type clienteSchemaType = z.infer<typeof clienteSchema>

const usuario = z.object({
  id: z.number().optional(),
  nome: z.number()
})
type usuarioType = z.infer<typeof usuario>

interface dataRow {
  id: number,
  idCliente: number,
  idVendedor: number,
  data: string,
  isVendaOS: boolean,
  situacao: number,  
  desconto : number, 
}

const Venda = () => {
  const today = new Date();
  const [sales, setSales] = useState<vendaSchemaType[]>([]);
  const [clientes, setClientes] = useState<clienteSchemaType[]>([]);
  const [selectedData, setSelectedData] = useState<dataRow | null>(null);
  const {toggleModal, open} = useOpenModal();

  const {register, handleSubmit, reset, control, setValue, formState: {errors}} = useForm<vendaSchemaType>({
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


 // CRUD -------------------------------------------------------------------------------------------------------------------------------- 
  async function getSales() {
    try {
      const response = await axios.get("http://localhost:3000/venda");
      setSales(response.data.vendas);
    } catch (error: any) {
      new Error(error);
    }
  }

  async function postSales(data: vendaSchemaType) {
    try {
      const response = await axios.post("http://localhost:3000/venda", data);
      if (response.status === 200) alert("venda cadastrado com sucesso!");
      getSales();
    } catch (error: any) {
      new Error(error);
    } finally {
      addOf()
    }
  }

  //-MODAIS-----------------------------------------------------------------------------------------------------------------------


  const handleEdit = (updateData: dataRow) => {
    setSelectedData(updateData);
    toggleModal()
  }


  const [adopen, setAdOpen] = useState<boolean>(false);
  const addOn = () => setAdOpen(true);
  const addOf = () => setAdOpen(false);

// GRID ------------------------------------------------

  const columns: GridColDef<dataRow>[] = [
    { field: "id", headerName: "id", editable: false, flex: 0 },
    {
      field: "IdCliente",
      headerName: "IdCliente",
      editable: false,
      flex: 0,
    },
    { field: "IdVendedor", headerName: "IdVendedor", editable: false, flex: 0 },
    { field: "data", headerName: "data", editable: false, flex: 0 },
    { field: "isVendaOS", headerName: "isVendaOS", editable: false, flex: 0 },
    { field: "situacao", headerName: "situacao", editable: false, flex: 0 },
    { field: "desconto", headerName: "desconto", editable: false, flex: 0 },

    {
      field: "acoes",
      headerName: "Ações",
      width: 150,
      align: "center",
      type: "actions",
      flex: 0,
      renderCell: ({ row }) => (
        <div>
          <IconButton onClick={() => row.id !== undefined && delPurchases(row.id)}>
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

  const rows = sales.map((venda) => ({
    id: venda.id,
    IdCliente: venda.IdCliente,
    IdVendedor: venda.IdVendedor,
    data: formatDate(venda.data),
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

              <form onSubmit={handleSubmit(postSales)}>
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
                helperText={errors.data?.message || "Obrigatório"}
                error={!!errors.data}
                defaultValue={dayjs(today).format("YYYY-MM-DD")}
                {...register('data')}
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
           <ModalRoot>

           <form onSubmit={handleSubmit(postSales)}>
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
                helperText={errors.data?.message || "Obrigatório"}
                error={!!errors.data}
                defaultValue={dayjs(today).format("YYYY-MM-DD")}
                {...register('data')}
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
    </Box>
  );
};

export default Venda;
