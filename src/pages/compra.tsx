import { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Modal,
  InputLabel,
  Select,
  Button,
  Typography,
  TextField,
  Stack,
  IconButton,
  MenuItem,
} from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { ModalStyle, GridStyle, SpaceStyle } from "./styles";
import { MiniDrawer } from "../components";
import dayjs from 'dayjs';

import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import DoneIcon from "@mui/icons-material/Done";


import {useForm, Controller } from "react-hook-form";
import { z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import { useOpenModal } from "../hooks/useOpenModal";
import { ModalDoBelone } from "../components/testeDoBelone";

const compraSchema = z.object({
  id: z.number().optional(),
  idFornecedor: z.coerce.number(),
  isCompraOS: z.boolean(),
  dataCompra: z.string(),
  numNota: z.coerce.number(),
  desconto: z.coerce.number(),
  isOpen: z.boolean(),
})

interface dataRow {
  id: number,
  idFornecedor: number,
  isCompraOS: boolean,
  dataCompra: string,
  numNota: number,
  desconto: number,
  isOpen: boolean,
}

type compraSchemaType = z.infer<typeof compraSchema>

const fornecedorSchema = z.object({
  id: z.number(),
  nome: z.string()
})
type fornecedorSchemaType = z.infer<typeof fornecedorSchema>


const Compra = () => {
  
  const today = new Date();
  const [selectedData, setSelectedData] = useState<dataRow | null>(null);
  const [purchases, setPurchases] = useState<compraSchemaType[]>([]);
  const [fornecedores, setFornecedores] = useState<fornecedorSchemaType[]>([]);

  const handleEdit = (updateData: compraSchemaType) => {
    toggleModal()
    setSelectedData(updateData)
    console.log(selectedData)
    console.log(dayjs(selectedData?.dataCompra, 'pt-BR').format("YYYY-MM-DD"))
  } 

  useEffect(() => {
    const getFornecedores = async () => {
      const response = await axios.get("http://localhost:3000/cliente/fornecedores");
      setFornecedores(response.data)
    };

    getFornecedores();
  }, []);


  // Modal ADD
  const [adopen, setAdOpen] = useState<boolean>(false);
  const addOn = () => setAdOpen(true);
  const addOf = () => setAdOpen(false);



  const {register, handleSubmit, reset, control, formState: {errors}, setValue} = useForm<compraSchemaType>({
    resolver: zodResolver(compraSchema)

  });

  async function getPurchases() {
    try {
      const response = await axios.get("http://localhost:3000/compra");
      setPurchases(response.data.compras);
      console.log(response.data.compras[0].dataCompra)
    } catch (error: any) {
      console.error(error);
    }
  }

  async function postPurchases(data: compraSchemaType) {
    const {id, ...mydata} = data

    try {
      const response = await axios.post("http://localhost:3000/compra", mydata);
      if (response.status === 200) alert("compra cadastrado com sucesso!");
      getPurchases();
    } catch (error: any) {
      console.error(error);
    } finally {
      addOf();
    }
  }

  async function delPurchases(id: number) {
    try {
      const response = await axios.delete(
        `http://localhost:3000/compra?id=${id}`);
      if (response.status === 200) alert("compra deletado com sucesso!");
      getPurchases();
    } catch (error: any) {
      console.error(error);
    }
  }

  useEffect(() => {
    getPurchases();
  }, []);

  
  
  const {open, toggleModal} = useOpenModal()
  
  useEffect(() => {
    getPurchases();
  }, [open]);

  const columns: GridColDef<compraSchemaType>[] = [
    { field: "id", headerName: "id", editable: false, flex: 0 },
    {
      field: "idFornecedor",
      headerName: "IdFornecedor",
      editable: false,
      flex: 0,
    },
    { field: "isCompraOS", headerName: "IsCompraOS", editable: false, flex: 0 },
    { field: "dataCompra", headerName: "DataCompra", editable: false, flex: 0 },
    { field: "numNota", headerName: "NumNota", editable: false, flex: 0 },
    { field: "desconto", headerName: "Desconto", editable: false, flex: 0 },
    { field: "isOpen", headerName: "isOpen", editable: false, flex: 0 },

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

  const rows = purchases.map((compra) => ({
    id: compra.id,
    idFornecedor: compra.idFornecedor,
    isCompraOS: compra.isCompraOS,
    dataCompra: compra.dataCompra,
    numNota: compra.numNota,
    desconto: compra.desconto,
    isOpen: compra.isOpen,
    
  }));
  useEffect(() => {
    reset()
  }, [fornecedorSchema, reset])

  return (
    <Box>
      <MiniDrawer />
      <Box sx={SpaceStyle}>
        <Typography>Estamos dentro do banco </Typography>
        <Typography>(Não iremos cometer nenhum assalto...)</Typography>
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
                Nova compra
              </Typography>
              <form onSubmit={handleSubmit(postPurchases)}>

                <Select 
                {...register('idFornecedor')}
                labelId="select-label"
                id="demo-simple-select"
                label="Fornecedor"
                fullWidth
                error={!!errors.idFornecedor}
                defaultValue={fornecedores.length > 0 ? fornecedores[0].nome : "Sem Fornecedores"}
                >
                  {fornecedores && fornecedores.map((fornecedor) => (
                    <MenuItem value={fornecedor.id}> {fornecedor.nome} </MenuItem>
                  ))}

                </Select>

             
              <InputLabel id="demo-simple-select-label">
                Compra ou OS
              </InputLabel>
              
               <Controller
                control={control}
                name="isCompraOS"
                defaultValue={true}
                render={({field}) => ( 
                <Select
                  onChange={field.onChange}
                  value={field.value}
                >
                  <MenuItem value={true}>Compra</MenuItem>
                  <MenuItem value={false}>OS</MenuItem>
                </Select>
                ) }
              /> 

              <TextField
                type="date"
                label={"Data compra"}
                InputLabelProps={{ shrink: true } }
                size="medium"
                helperText={errors.dataCompra?.message || "Obrigatório"}
                error={!!errors.dataCompra}
                defaultValue={dayjs(today).format("YYYY-MM-DD")}
                {...register('dataCompra')}
              />

              <TextField
                id="outlined-numNota"
                label="Número da Nota"
                defaultValue={0}
                helperText={errors.numNota?.message || "Obrigatório"}
                error={!!errors.numNota}
                {...register('numNota')}
              />
              <TextField
                id="outlined-desconto"
                label="Desconto"
                defaultValue={0}
                helperText={errors.desconto?.message || "Obrigatório"}
                error={!!errors.desconto}
                {...register('desconto')}
              />

              <InputLabel id="demo-simple-select-label">
                IsOpen
              </InputLabel>

              <Controller
                control={control}
                name="isOpen"
                defaultValue={true}
                render={({field}) => (
                <Select
                  onChange={field.onChange}
                  labelId="select-label"
                  id="demo-simple-select"
                  label="isOpen"
                  value={field.value}
                  >
                  <MenuItem value={true}>Open</MenuItem>
                  <MenuItem value={false}>Close</MenuItem>
                </Select>
                
              )}
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
          
          {open && selectedData ? <ModalDoBelone data={selectedData} open={open} toggleModal={toggleModal} /> : null }
          
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

export default Compra;
