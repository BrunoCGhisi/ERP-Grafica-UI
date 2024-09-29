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

import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import DoneIcon from "@mui/icons-material/Done";


import {useForm } from "react-hook-form";
import { z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";

const compraSchema = z.object({
  id: z.number().optional(),
  idFornecedor: z.coerce.number(),
  isCompraOS: z.boolean(),
  dataCompra: z.string(),
  numNota: z.coerce.number(),
  desconto: z.coerce.number(),
  isOpen: z.boolean(),
})
type compraSchemaType = z.infer<typeof compraSchema>

const fornecedorSchema = z.object({
  id: z.number(),
  nome: z.string()
})
type fornecedorSchemaType = z.infer<typeof fornecedorSchema>


const Compra = () => {

  const [purchases, setPurchases] = useState<compraSchemaType[]>([]);
  const [fornecedores, setFornecedores] = useState<fornecedorSchemaType[]>([]);

  useEffect(() => {
    const getFornecedores = async () => {
      const response = await axios.get("http://localhost:3000/cliente/fornecedores");
      setFornecedores(response.data)
      console.log("forncededores", response.data)
      console.log(fornecedores)
    };

    getFornecedores();
  }, []);


  // Modal ADD
  const [adopen, setAdOpen] = useState<boolean>(false);
  const addOn = () => setAdOpen(true);
  const addOf = () => setAdOpen(false);

  // Modal PUT
  const [popen, setPOpen] = useState<boolean>(false);
  const putOn = (id: number) => {

    const compraFilter = purchases.filter((compra: compraSchemaType) => compra.id === id)
    if (compraFilter.length > 0){
    setValue('id', id);
    setValue('idFornecedor', compraFilter[0].idFornecedor);
    setValue('isCompraOS', compraFilter[0].isCompraOS);
    setValue('numNota', compraFilter[0].numNota);
    setValue('desconto', compraFilter[0].desconto);
    setValue('isOpen', compraFilter[0].isOpen);
  }

    setPOpen(true);
  };
  const putOf = () => setPOpen(false);

  const {register, handleSubmit, formState: {errors}, setValue} = useForm<compraSchemaType>({
    resolver: zodResolver(compraSchema),
    defaultValues: {
      idFornecedor: fornecedores.length > 0 ? fornecedores[0].id : 0,
      isCompraOS: false,  // Valor inicial
      dataCompra: '',  // Defina um valor inicial como string vazia
      numNota: 0,  // Valor inicial
      desconto: 0,  // Valor inicial
      isOpen: false  // Valor inicial
    }
  });

  async function getPurchases() {
    try {
      const response = await axios.get("http://localhost:3000/compra");
      setPurchases(response.data.compras);
    } catch (error: any) {
      console.error(error);
    }
  }

  async function postPurchases(data: compraSchemaType) {
    try {
      const response = await axios.post("http://localhost:3000/compra", data);
      if (response.status === 200) alert("compra cadastrado com sucesso!");
      getPurchases();
    } catch (error: any) {
      console.error(error);
    } finally {
      addOf();
    }
  }

  async function putPurchases(data: compraSchemaType) {
    try {
      const response = await axios.put(`http://localhost:3000/compra?id=${data.id}`, data);
      if (response.status === 200) alert("COmpra atualizado com sucesso!");
      getPurchases();
    } catch (error: any) {
      console.error(error);
    } finally {
      putOf();
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
            onClick={() => row.id !== undefined && putOn(row.id)}>
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
                Novo banco
              </Typography>
              <form onSubmit={handleSubmit(postPurchases)}>

                <Select 
                {...register('idFornecedor')}
                labelId="select-label"
                id="demo-simple-select"
                label="Fornecedor"
                fullWidth
                error={!!errors.idFornecedor}
                >
                  {fornecedores && fornecedores.map((fornecedor) => (
                    <MenuItem value={fornecedor.id}> {fornecedor.nome} </MenuItem>
                  ))}

                </Select>

             
              <InputLabel id="demo-simple-select-label">
                Compra ou OS
              </InputLabel>

              <Select
              {...register('isCompraOS')}
              labelId="select-label"
              id="demo-simple-select"
              label="isCompraOS"
              error={!!errors.isCompraOS}
              defaultValue={false}
              
            >
              <MenuItem value="true">Compra</MenuItem>
              <MenuItem value="false">OS</MenuItem>
            </Select>

    

              <TextField
                type="date"
                label={"Data compra"}
                InputLabelProps={{ shrink: true }}
                size="medium"
                helperText={errors.dataCompra?.message || "Obrigatório"}
                error={!!errors.dataCompra}
                {...register('dataCompra')}
              />

              <TextField
                id="outlined-numNota"
                label="Número da Nota"
                helperText={errors.numNota?.message || "Obrigatório"}
                error={!!errors.numNota}
                {...register('numNota')}
              />
              <TextField
                id="outlined-desconto"
                label="Desconto"
                helperText={errors.desconto?.message || "Obrigatório"}
                error={!!errors.desconto}
                {...register('desconto')}
              />

              <Select
               {...register('isOpen')}
                labelId="select-label"
                id="demo-simple-select"
                label="isOpen"
                error={!!errors.isOpen}
                defaultValue={false}
                >
                <MenuItem value={'true'}>Open</MenuItem>
                <MenuItem value={'false'}>Close</MenuItem>
              </Select>


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
            open={popen}
            onClose={putOf}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={ModalStyle}>
              <Typography id="modal-modal-title" variant="h6" component="h2">
                Editar Banco
              </Typography>

              <form onSubmit={handleSubmit(putPurchases)}>
              <TextField
                id="outlined-idFornecedor"
                label="ID Fornecedor"
                helperText={errors.idFornecedor?.message || "Obrigatório"}
                error={!!errors.idFornecedor}
                {...register('idFornecedor')}
              />
              <InputLabel id="demo-simple-select-label">
                Compra ou OS
              </InputLabel>

              <Select
                {...register('isCompraOS')}
                labelId="select-label"
                id="demo-simple-select"
                label="isCompraOS"
                error={!!errors.isCompraOS}
                defaultValue={false}
                >
                <MenuItem value={"true"}>Compra</MenuItem>
                <MenuItem value={"false"}>OS </MenuItem>
              </Select>

              <TextField
                type="date"
                label={"Data compra"}
                InputLabelProps={{ shrink: true }}
                size="medium"
                helperText={errors.dataCompra?.message || "Obrigatório"}
                error={!!errors.dataCompra}
                {...register('dataCompra')}
              />

              <TextField
                id="outlined-numNota"
                label="Número da Nota"
                helperText={errors.numNota?.message || "Obrigatório"}
                error={!!errors.numNota}
                {...register('numNota')}
              />
              <TextField
                id="outlined-desconto"
                label="Desconto"
                helperText={errors.desconto?.message || "Obrigatório"}
                error={!!errors.desconto}
                {...register('desconto')}
              />

              <InputLabel id="demo-simple-select-label">
                Em aberto?
              </InputLabel>

              <Select
               {...register('isOpen')}
                labelId="select-label"
                id="demo-simple-select"
                label="isOpen"
                error={!!errors.isOpen}
                defaultValue={false}
                >
                <MenuItem value={"true"}>Open</MenuItem>
                <MenuItem value={"false"}>Close</MenuItem>
              </Select>

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
