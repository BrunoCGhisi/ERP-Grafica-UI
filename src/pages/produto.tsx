import { useState, useEffect } from "react";
import { ProductVO } from "../shared/services/types";
import axios from "axios";
import {
  Accordion,
  AccordionDetails,
  Box,
  InputLabel,
  Select,
  MenuItem,
  Modal,
  AccordionSummary,
  Button,
  Divider,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { ModalStyle, GridStyle, SpaceStyle } from "../shared/styles";
import { MiniDrawer } from "../shared/components";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import DoneIcon from "@mui/icons-material/Done";

const Produto = () => {
  const [products, setProducts] = useState<ProductVO[]>([]);
  const [productId, setProductId] = useState<string>("");
  const [nome, setNome] = useState<string>("");
  const [tipo, setTipo] = useState<string>("");
  const [keyWord, setKeyWord] = useState<string>("");
  const [idCategoria, setIdCategoria] = useState<string>("");
  const [preco, setPreco] = useState<string>("");
  const [tamanho, setTamanho] = useState<string>("");
  const [isEstoque, setIsEstoque] = useState<string>("");
  const [minEstoque, setMinEstoque] = useState<string>("");
  const [estoque, setEstoque] = useState<string>("");

  // Modal ADD
  const [adopen, setAdOpen] = useState<boolean>(false);
  const addOn = () => setAdOpen(true);
  const addOf = () => setAdOpen(false);

  // Modal PUT
  const [popen, setPOpen] = useState<boolean>(false);
  const putOn = (
    id: string,
    nome: string,
    tipo: string,
    keyWord: string,
    idCategoria: string,
    preco: string,
    tamanho: string,
    isEstoque: string,
    minEstoque: string,
    estoque: string
  ) => {
    setProductId(id);
    setNome(nome);
    setTipo(tipo);
    setKeyWord(keyWord);
    setIdCategoria(idCategoria);
    setPreco(preco);
    setTamanho(tamanho);
    setIsEstoque(isEstoque);
    setMinEstoque(minEstoque);
    setEstoque(estoque);

    setPOpen(true);
  };
  const putOf = () => setPOpen(false);

  async function getProducts() {
    try {
      const response = await axios.get("http://localhost:3000/produto");
      setProducts(response.data.produtos);
    } catch (error: any) {
      console.error(error);
    }
  }

  async function postProducts() {
    try {
      const response = await axios.post("http://localhost:3000/produto", {
        nome: nome,
        tipo: tipo,
        keyWord: keyWord,
        idCategoria: idCategoria,
        preco: preco,
        tamanho: tamanho,
        isEstoque: isEstoque,
        minEstoque: minEstoque,
        estoque: estoque,
      });
      if (response.status === 200) alert("Produto cadastrado com sucesso!");
      getProducts();
    } catch (error: any) {
      console.error(error);
    } finally {
      addOf();
    }
  }

  async function putProducts() {
    try {
      const response = await axios.put(
        `http://localhost:3000/produto?id=${productId}`,
        {
          nome: nome,
          tipo: tipo,
          keyWord: keyWord,
          idCategoria: idCategoria,
          preco: preco,
          tamanho: tamanho,
          isEstoque: isEstoque,
          minEstoque: minEstoque,
          estoque: estoque,
        }
      );
      if (response.status === 200) alert("Produto atualizado com sucesso!");
      getProducts();
    } catch (error: any) {
      console.error(error);
    } finally {
      putOf();
    }
  }

  async function delProducts(id: string) {
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

  const columns: GridColDef<ProductVO>[] = [
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
          <IconButton onClick={() => delProducts(row.id)}>
            <DeleteIcon />
          </IconButton>
          <IconButton
            onClick={() =>
              putOn(
                row.id,
                row.nome,
                row.tipo,
                row.keyWord,
                row.idCategoria,
                row.preco,
                row.tamanho,
                row.isEstoque,
                row.minEstoque,
                row.estoque
              )
            }
          >
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
                helperText="Obrigatório"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
              />

              <InputLabel id="demo-simple-select-label">Tipo</InputLabel>
              <Select
                labelId="select-label"
                id="demo-simple-select"
                value={tipo}
                label="Tipo"
                onChange={(e) => setTipo(e.target.value)}
              >
                <MenuItem value={0}>Não</MenuItem>
                <MenuItem value={1}>Sim </MenuItem>
              </Select>

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

              <InputLabel id="demo-simple-select-label">isEstoque</InputLabel>
              <Select
                labelId="select-label"
                id="demo-simple-select"
                value={isEstoque}
                label="Estoque é controlado?"
                onChange={(e) => setIsEstoque(e.target.value)}
              >
                <MenuItem value={0}>Não</MenuItem>
                <MenuItem value={1}>Sim </MenuItem>
              </Select>

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
                onClick={postProducts}
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
