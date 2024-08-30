import { useState, useEffect } from "react";
import { ProductCategoryVO } from "../services/types";
import axios from "axios";
import {
  Box,
  Modal,
  Button,
  Typography,
  TextField,
  Stack,
  IconButton
} from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { ModalStyle } from "./styles";


import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import DoneIcon from "@mui/icons-material/Done";

const CategoriaProduto = () => {
    const [productCategorys, setProductCategorys] = useState<ProductCategoryVO[]>([]);
    const [productCategoryId, setProductCategoryId] = useState<string>("")
    const [categoria, setCategoria]     = useState<string>("")
    

    // Modal ADD
  const [adopen, setAdOpen] = useState<boolean>(false);
  const addOn = () => setAdOpen(true);
  const addOf = () => setAdOpen(false);

  // Modal PUT
  const [popen, setPOpen] = useState<boolean>(false);
  const putOn = (id: string, categoria: string) => {
    setProductCategoryId(id);
    setCategoria(categoria);

    setPOpen(true);
  };
  const putOf = () => setPOpen(false);

  async function getProductCategorys() {
    try {
      const response = await axios.get("http://localhost:3000/categorias_produtos");
      setProductCategorys(response.data.categorias_produtos);
    } catch (error: any) {
      console.error(error);
    }
  }

  async function postProductCategorys() {
    try {
      const response = await axios.post("http://localhost:3000/categorias_produtos", {
        categoria: categoria,
        
      });
      if (response.status === 200) alert("Categoria do produto cadastrado com sucesso!");
      getProductCategorys();
    } catch (error: any) {
      console.error(error);
    } finally {
      addOf();
    }
  }
  async function putProductCategorys() {
    try {
      const response = await axios.put(
        `http://localhost:3000/categorias_produtos?id=${productCategoryId}`,
        {
          categoria: categoria,
        }
      );
      if (response.status === 200) alert("Usuário atualizado com sucesso!");
      getProductCategorys();
    } catch (error: any) {
      console.error(error);
    } finally {
      putOf();
    }
  }

  async function delProductCategorys(id: string) {
    try {
      const response = await axios.delete(`http://localhost:3000/categorias_produtos?id=${id}`);
      if (response.status === 200) alert("Banco deletado com sucesso!");
      getProductCategorys();
    } catch (error: any) {
      console.error(error);
    }
  }

  useEffect(() => {
    getProductCategorys();
  }, []);

  const columns: GridColDef<ProductCategoryVO>[] = [
    { field: "id", headerName: "ID", align: "left", flex: 0 },
    { field: "categoria", headerName: "Categoria", editable: false, flex: 0 },

    {
      field: "acoes",
      headerName: "Ações",
      width: 150,
      align: "center",
      type: "actions",
      flex: 0,
      renderCell: ({ row }) => (
        <div>
          <IconButton onClick={() => delProductCategorys(row.id)}>
            <DeleteIcon />
          </IconButton>
          <IconButton onClick={() => putOn(row.id, row.categoria)}>
            <EditIcon />
          </IconButton>
        </div>
      ),
    },
  ];

  const rows = productCategorys.map((categoriaProduto) => ({
    id: categoriaProduto.id,
    categoria: categoriaProduto.categoria
    

  }));
  

    return (
        <Box>
            <Typography>Estamos dentro do categoriaProduto </Typography>
            <Typography>(Não iremos cometer nenhum assalto...)</Typography>
            <Box>
        <Stack direction="row" spacing={2}>
          <Button onClick={addOn} variant="outlined" startIcon={<AddCircleOutlineIcon />}>
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
            <TextField
              id="outlined-helperText"
              label="categoriaProduto"
              helperText="Obrigatório"
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
            />
            <Button
              onClick={postProductCategorys}
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
              Editar Categoria Produtos
            </Typography>
            <TextField
              id="outlined-helperText"
              label="categoria"
              helperText="Obrigatório"
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
            />

            <Button
              onClick={putProductCategorys}
              variant="outlined"
              startIcon={<DoneIcon />}
            >
              Alterar
            </Button>
          </Box>
        </Modal>
      </Box>
      <Box>
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
        
    )
}

export default CategoriaProduto