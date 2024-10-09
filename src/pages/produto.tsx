import { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  InputLabel,
  Select,
  MenuItem,
  Modal,
  Button,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { ModalStyle, GridStyle, SpaceStyle } from "../shared/styles";
import { MiniDrawer } from "../shared/components";

import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import DoneIcon from "@mui/icons-material/Done";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ModalRoot } from "../shared/components/ModalRoot";
import { useOpenModal } from "../shared/hooks/useOpenModal";
import { Controller, useForm } from "react-hook-form";

const produtoSchema = z.object({
  id: z.number().optional(),
  nome: z.string(),
  tipo: z.boolean(),
  keyWord: z.string(),
  idCategoria: z.number(),
  preco: z.number(),
  tamanho: z.number(),
  isEstoque: z.boolean(),
  minEstoque: z.number(),
  estoque: z.number(),
})

interface dataRow {
  id: number,
  nome: string,
  tipo: boolean,
  keyWord: string,
  idCategoria: number,
  preco: number,
  tamanho: number,
  isEstoque: boolean,
  minEstoque: number,
  estoque: number,
}

type produtoSchemaType = z.infer<typeof produtoSchema>

const Produto = () => {

  const {register, setValue, reset, control, formState: {errors}, handleSubmit} = useForm<produtoSchemaType>();
  const [products, setProducts] = useState<produtoSchemaType[]>([]);
  const [selectedData, setSelectedData] = useState<dataRow | null>(null);
  const {toggleModal, open} = useOpenModal();

  const handleEdit = (updateDate: dataRow)=>{
    setSelectedData(updateDate)
    toggleModal()
  }

  // Modal ADD
  const [adopen, setAdOpen] = useState<boolean>(false);
  const addOn = () => setAdOpen(true);
  const addOf = () => setAdOpen(false);

  // CRUDs--------------------------------------------------  

  async function getProducts() {
    try {
      const response = await axios.get("http://localhost:3000/produto");
      setProducts(response.data.produtos);
    } catch (error: any) {
      console.error(error);
    }
  }

  async function postProducts(data: produtoSchemaType) {
    try {
      const response = await axios.post("http://localhost:3000/produto", data);
      if (response.status === 200) alert("Produto cadastrado com sucesso!");
      getProducts();
    } catch (error: any) {
      console.error(error);
    } finally {
      toggleModal();
    }
  }

  async function putProducts(data: produtoSchemaType) {
    try {
      const response = await axios.put(`http://localhost:3000/produto?id=${data.id}`, data);
      if (response.status === 200) alert("Produto atualizado com sucesso!");
      getProducts();
    } catch (error: any) {
      console.error(error);
    } finally {
      toggleModal();
    }
  }

  async function delProducts(id: number) {
    try {
      const response = await axios.delete(
        `http://localhost:3000/produto?id=${id}`
      );
      if (response.status === 200) alert("Produto deletado com sucesso!");
      getProducts();
    } catch (error: any) {
      console.error(error);
    }
  }

  useEffect(() => {
    getProducts();
  }, []);

  const columns: GridColDef<dataRow>[] = [
    { field: "id", headerName: "id", editable: false, flex: 0 },
    { field: "nome", headerName: "nome", editable: false, flex: 0 },
    { field: "tipo", headerName: "tipo", editable: false, flex: 0 },
    { field: "keyWord", headerName: "keyWord", editable: false, flex: 0 },
    {
      field: "idCategoria",
      headerName: "idCategoria",
      editable: false,
      flex: 0,
    },
    { field: "preco", headerName: "preco", editable: false, flex: 0 },
    { field: "tamanho", headerName: "tamanho", editable: false, flex: 0 },
    { field: "isEstoque", headerName: "isEstoque", editable: false, flex: 0 },
    { field: "minEstoque", headerName: "minEstoque", editable: false, flex: 0 },
    { field: "estoque", headerName: "estoque", editable: false, flex: 0 },

    {
      field: "acoes",
      headerName: "Ações",
      width: 150,
      align: "center",
      type: "actions",
      flex: 0,
      renderCell: ({ row }) => (
        <div>
          <IconButton onClick={() => row.id !== undefined && delProducts(row.id)}>
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

  const rows = products.map((produto) => ({
    id: produto.id,
    nome: produto.nome,
    tipo: produto.tipo,
    keyWord: produto.keyWord,
    idCategoria: produto.idCategoria,
    preco: produto.preco,
    tamanho: produto.tamanho,
    isEstoque: produto.isEstoque,
    minEstoque: produto.minEstoque,
    estoque: produto.estoque,
  }));

  return (
    <Box>
      <MiniDrawer />
      <Box sx={SpaceStyle}>
        <Typography>Produtos </Typography>
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
                Novo produto
              </Typography>

              <TextField
                id="outlined-helperText"
                label="Nome"
                defaultValue=""
                helperText={errors.nome?.message || "Obrigatório"}
                error={!!errors.nome}
                {...register('nome')}
              />

              <InputLabel id="demo-simple-select-label">Tipo</InputLabel>

              <Controller
                control={control}
                name="tipo"
                defaultValue={true}
                render={({field}) => (<Select
                  labelId="select-label"
                  id="demo-simple-select"
                  label="Tipo"
                  value={field.value}
                  onChange={field.onChange}
                >
                  <MenuItem value={true}>Não</MenuItem>
                  <MenuItem value={false}>Sim </MenuItem>
                </Select>)}/>

              <TextField
                id="outlined-helperText"
                label="KeyWord"
                helperText={errors.keyWord?.message || "Obrigatório"}
                error={!!errors.keyWord}
                {...register('keyWord')}
              />

              <TextField
                id="outlined-helperText"
                label="ID Categoria"
                helperText={errors.idCategoria?.message || "Obrigatório"}
                error={!!errors.idCategoria}
                {...register('idCategoria')}
              />

              <TextField
                id="outlined-helperText"
                label="Preço"
                helperText={errors.preco?.message || "Obrigatório"}
                error={!!errors.preco}
                {...register('preco')}
              />

              <TextField
                id="outlined-helperText"
                label="Tamanho"
                helperText={errors.tamanho?.message || "Obrigatório"}
                error={!!errors.tamanho}
                {...register('tamanho')}
              />

              <InputLabel id="demo-simple-select-label">isEstoque</InputLabel>

              <Controller
              control={control}
              defaultValue={true}
              name="isEstoque"
              render={({field}) => (<Select
                labelId="select-label"
                id="demo-simple-select"
                value={field.value}
                label="Estoque é controlado?"
                onChange={field.onChange}
              >
                <MenuItem value={0}>Não</MenuItem>
                <MenuItem value={1}>Sim </MenuItem>
              </Select>)} />

              <TextField
                id="outlined-helperText"
                label="Mínimo em Estoque"
                helperText={errors.minEstoque?.message || "Obrigatório"}
                error={!!errors.minEstoque}
                {...register('minEstoque')}
              />

              <TextField
                id="outlined-helperText"
                label="Estoque"
                helperText={errors.estoque?.message || "Obrigatório"}
                error={!!errors.estoque}
                {...register('estoque')}
              />

              <Button
                type="submit"
                variant="outlined"
                startIcon={<DoneIcon />}
              >
                Cadastrar
              </Button>
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
              <TextField
                id="outlined-helperText"
                label="Nome"
                helperText="Obrigatório"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
              />
              <TextField
                id="outlined-helperText"
                label="Nome"
                helperText="Obrigatório"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
              />

              <TextField
                id="outlined-helperText"
                label="Tipo"
                helperText="Obrigatório"
                value={tipo}
                onChange={(e) => setTipo(e.target.value)}
              />

              <TextField
                id="outlined-helperText"
                label="KeyWord"
                helperText="Obrigatório"
                value={keyWord}
                onChange={(e) => setKeyWord(e.target.value)}
              />

              <TextField
                id="outlined-helperText"
                label="ID Categoria"
                helperText="Obrigatório"
                value={idCategoria}
                onChange={(e) => setIdCategoria(e.target.value)}
              />

              <TextField
                id="outlined-helperText"
                label="Preço"
                helperText="Obrigatório"
                value={preco}
                onChange={(e) => setPreco(e.target.value)}
              />

              <TextField
                id="outlined-helperText"
                label="Tamanho"
                helperText="Obrigatório"
                value={tamanho}
                onChange={(e) => setTamanho(e.target.value)}
              />

              <TextField
                id="outlined-helperText"
                label="Estoque Disponível"
                helperText="Obrigatório"
                value={isEstoque}
                onChange={(e) => setIsEstoque(e.target.value)}
              />

              <TextField
                id="outlined-helperText"
                label="Mínimo em Estoque"
                helperText="Obrigatório"
                value={minEstoque}
                onChange={(e) => setMinEstoque(e.target.value)}
              />

              <TextField
                id="outlined-helperText"
                label="Estoque"
                helperText="Obrigatório"
                value={estoque}
                onChange={(e) => setEstoque(e.target.value)}
              />

              <Button
                onClick={putProducts}
                variant="outlined"
                startIcon={<DoneIcon />}
              >
                Alterar
              </Button>
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

export default Produto;
