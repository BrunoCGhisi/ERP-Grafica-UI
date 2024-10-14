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

const insumoSchema = z.object({
  id: z.number(),
  nome: z.string()
})
type insumoSchemaType = z.infer<typeof insumoSchema>

const categoriaSchema = z.object({
  id: z.number(),
  categoria: z.string()
})
type categoriaSchemaType = z.infer<typeof categoriaSchema>

const produtoSchema = z.object({
  id: z.number().optional(),
  nome: z.string(),
  tipo: z.boolean(),
  keyWord: z.string(),
  idCategoria: z.number(),
  idInsumo: z.number(),
  preco: z.coerce.number(),
  tamanho: z.coerce.number(),
})

interface dataRow {
  id: number,
  nome: string,
  tipo: boolean,
  keyWord: string,
  idCategoria: number,
  idInsumo: number,
  preco: number,
  tamanho: number,
}

type produtoSchemaType = z.infer<typeof produtoSchema>

const Produto = () => {

  const {register, setValue, reset, control, formState: {errors}, handleSubmit} = useForm<produtoSchemaType>({
    resolver: zodResolver(produtoSchema)
  });
  const [products, setProducts] = useState<produtoSchemaType[]>([]);
  const [insumos, setInsumos] = useState<insumoSchemaType[]>([]);
  const [categorias, setCategorias] = useState<categoriaSchemaType[]>([]);
  const [selectedData, setSelectedData] = useState<dataRow | null>(null);
  const {toggleModal, open} = useOpenModal();

  const handleEdit = (updateDate: dataRow)=>{
    setSelectedData(updateDate)
    toggleModal()
  }

  // Modal ADD
  const [adopen, setAdOpen] = useState<boolean>(false);
  const addOn = () => {setAdOpen(true), reset()};
  const addOf = () => setAdOpen(false);

  useEffect(() => {
    if (selectedData) {
      setValue("id", selectedData.id);
      setValue("nome", selectedData.nome);
      setValue("tipo", selectedData.tipo);
      setValue("keyWord",selectedData.keyWord);
      setValue("idCategoria", selectedData.idCategoria);
      setValue("idInsumo", selectedData.idInsumo);
      setValue("preco", selectedData.preco);
      setValue("tamanho", selectedData.tamanho);
    }
  }, [selectedData, setValue]); 

  // Trazendo isnumos e categoria  --------------------------------
  useEffect(() => {
    const getInsumos = async () => {
      const response = await axios.get("http://localhost:3000/insumo/itens");
      setInsumos(response.data)
    };
    getInsumos();
  }, [])

  useEffect(() => {
    const getCategorias = async () => {
      const response = await axios.get("http://localhost:3000/categoria_produto/itens");
      setCategorias(response.data)
    };
    getCategorias();
  }, [])

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
    const {id, ...mydata} = data
    try {
      const response = await axios.post("http://localhost:3000/produto", mydata);
      if (response.status === 200) alert("Produto cadastrado com sucesso!");
      getProducts();
    } catch (error: any) {
      console.error(error);
    } finally {
      addOf();
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
    {
      field: "idInsumo",
      headerName: "idInsumo",
      editable: false,
      flex: 0,
    },
    { field: "preco", headerName: "preco", editable: false, flex: 0 },
    { field: "tamanho", headerName: "tamanho", editable: false, flex: 0 },

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
    idInsumo: produto.idInsumo,
    preco: produto.preco,
    tamanho: produto.tamanho,
  }));
  useEffect(() => {
    reset()
  }, [insumoSchema, categoriaSchema, reset])

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
              
              <form onSubmit={handleSubmit(postProducts)}>

              <InputLabel id="demo-simple-select-label">Insumos</InputLabel>
              <Select
                {...register('idInsumo')}
                labelId="select-label"
                id="demo-simple-select"
                label="idInsumo"
                error={!!errors.idInsumo}
                defaultValue={insumos.length > 0 ? insumos[0].nome : "Sem insumos"}>
                  {insumos && insumos.map((insumo) => (
                    <MenuItem value={insumo.id}>{insumo.nome}</MenuItem>))}
              </Select>

              <InputLabel id="demo-simple-select-label">Categorias</InputLabel>
              <Select
                {...register('idCategoria')}
                labelId="select-label"
                id="demo-simple-select"
                label="idCategoria"
                error={!!errors.idCategoria}
                defaultValue={categorias.length > 0 ? categorias[0].categoria : "Sem categorias"}>
                  {categorias && categorias.map((categoria) => (
                    
                    <MenuItem value={categoria.id}>{categoria.categoria}</MenuItem>))}
              </Select>


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
                render={({field}) => (
                <Select
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
                type="number"
                id="outlined-helperText"
                label="Preço"
                helperText={errors.preco?.message || "Obrigatório"}
                error={!!errors.preco}
                defaultValue={0}
                {...register('preco')}
              />

              <TextField
                id="outlined-helperText"
                label="Tamanho"
                helperText={errors.tamanho?.message || "Obrigatório"}
                error={!!errors.tamanho}
                {...register('tamanho')}
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
{/* ------------------------------------------------------------------------------------------------------- */}
          <Modal
            open={open}
            onClose={toggleModal}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <ModalRoot>

            <form onSubmit={handleSubmit(putProducts)}>

            <InputLabel id="demo-simple-select-label">Insumos</InputLabel>
              <Select
                {...register('idInsumo')}
                labelId="select-label"
                id="demo-simple-select"
                label="idInsumo"
                error={!!errors.idInsumo}
                defaultValue={insumos.length > 0 ? insumos[0].nome : "Sem insumos"}>
                  {insumos && insumos.map((insumo) => (
                    <MenuItem value={insumo.id}>{insumo.nome}</MenuItem>))}
              </Select>

              <InputLabel id="demo-simple-select-label">Categorias</InputLabel>
              <Select
                {...register('idCategoria')}
                labelId="select-label"
                id="demo-simple-select"
                label="idCategoria"
                error={!!errors.idCategoria}
                defaultValue={categorias.length > 0 ? categorias[0].categoria : "Sem categorias"}>
                  {categorias && categorias.map((categoria) => (
                    
                    <MenuItem value={categoria.id}>{categoria.categoria}</MenuItem>))}
              </Select>


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
                render={({field}) => (
                <Select
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
                type="number"
                id="outlined-helperText"
                label="Preço"
                helperText={errors.preco?.message || "Obrigatório"}
                error={!!errors.preco}
                defaultValue={0}
                {...register('preco')}
              />

              <TextField
                id="outlined-helperText"
                label="Tamanho"
                helperText={errors.tamanho?.message || "Obrigatório"}
                error={!!errors.tamanho}
                {...register('tamanho')}
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

export default Produto;
