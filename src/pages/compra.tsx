import { useState, useEffect } from "react";
import { PurchaseVO } from "../services/types";
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

import {useForm} from "react-hook-form";
import { z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";

const compraSchema = z.object({
  id: z.number().optional(),
  idFornecedor: z.number(),
  isCompraOS: z.boolean(),
  dataCompra: z.date(),
  numNota: z.string(),
  desconto: z.string(),
  isOpen: z.boolean(),
})

type compraSchemaType = z.infer<typeof compraSchema>

const Compra = () => {
  const [purchases, setPurchases] = useState<compraSchemaType[]>([]);

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
    setValue('dataCompra', compraFilter[0].dataCompra);
    setValue('numNota', compraFilter[0].numNota);
    setValue('desconto', compraFilter[0].desconto);
    setValue('isOpen', compraFilter[0].isOpen);
  }

    setPOpen(true);
  };
  const putOf = () => setPOpen(false);

  const {register, handleSubmit, formState: {errors}, setValue} = useForm<compraSchemaType>({
    resolver: zodResolver(compraSchema)
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
                labelId="select-label"
                id="demo-simple-select"
                label="isCompraOS"
                error={!!errors.isCompraOS}
                {...register('isCompraOS')}
                defaultValue={"false"}
                >
                <MenuItem value={"true"}>Compra</MenuItem>
                <MenuItem value={"false"}>OS </MenuItem>
              </Select>

              <TextField
                id="outlined-dataCompra"
                label="Data Compra"
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
                labelId="select-label"
                id="demo-simple-select"
                label="isCompraOS"
                error={!!errors.isCompraOS}
                {...register('isCompraOS')}
                defaultValue={"false"}
                >
                <MenuItem value={"true"}>Compra</MenuItem>
                <MenuItem value={"false"}>OS </MenuItem>
              </Select>

              <TextField
                id="outlined-dataCompra"
                label="Data Compra"
                helperText={errors.dataCompra?.message || "Obrigatório"}
                error={!!errors.dataCompra}
                {...register('dataCompra')}

              <DatePicker label="Uncontrolled picker" defaultValue={dayjs('2022-04-17')} />

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
                labelId="select-label"
                id="demo-simple-select"
                label="isOpen"
                error={!!errors.isOpen}
                {...register('isOpen')}
                defaultValue={"false"}
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
