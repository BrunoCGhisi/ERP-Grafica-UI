import { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Modal,
  Button,
  Typography,
  TextField,
  Stack,
  IconButton,
} from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { ModalStyle, SpaceStyle } from "./styles";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import DoneIcon from "@mui/icons-material/Done";
import { MiniDrawer } from "../shared/components";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const productCategorySchema = z.object({
  id: z.number().optional(),
  categoria: z.string(),
});

type productCategorySchemaType = z.infer<typeof productCategorySchema>;

const CategoriaProduto = () => {
  const [productCategorys, setProductCategorys] = useState<
    productCategorySchemaType[]
  >([]);

  // Modal ADD
  const [adopen, setAdOpen] = useState<boolean>(false);
  const addOn = () => setAdOpen(true);
  const addOf = () => setAdOpen(false);

  // Modal PUT
  const [popen, setPOpen] = useState<boolean>(false);
  const putOn = (id: number) => {
    const prodCatFilter = productCategorys.filter(
      (prodCat: productCategorySchemaType) => prodCat.id === id
    );
    if (prodCatFilter.length > 0) {
      setValue("id", prodCatFilter[0].id);
      setValue("categoria", prodCatFilter[0].categoria);
    }
    setPOpen(true);
  };
  const putOf = () => setPOpen(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<productCategorySchemaType>({
    resolver: zodResolver(productCategorySchema),
  });

  // CRUD ----------------------------------------------------------------------------------------------------------------------------
  async function getProductCategorys() {
    try {
      const response = await axios.get(
        "http://localhost:3000/categoria_produto"
      );
      setProductCategorys(response.data.categorias_produtos);
    } catch (error: any) {
      console.error(error);
    }
  }

  async function postProductCategorys(data: productCategorySchemaType) {
    try {
      const response = await axios.post(
        "http://localhost:3000/categoria_produto",
        data
      );
      if (response.status === 200)
        alert("Categoria do produto cadastrado com sucesso!");
      getProductCategorys();
    } catch (error: any) {
      console.error(error);
    } finally {
      addOf();
    }
  }
  async function putProductCategorys(data: productCategorySchemaType) {
    try {
      const response = await axios.put(
        `http://localhost:3000/categoria_produto?id=${data.id}`,
        data
      );
      if (response.status === 200) alert("Usuário atualizado com sucesso!");
      getProductCategorys();
    } catch (error: any) {
      console.error(error);
    } finally {
      putOf();
    }
  }

  async function delProductCategorys(id: number) {
    try {
      const response = await axios.delete(
        `http://localhost:3000/categoria_produto?id=${id}`
      );
      if (response.status === 200) alert("Banco deletado com sucesso!");
      getProductCategorys();
    } catch (error: any) {
      console.error(error);
    }
  }

  useEffect(() => {
    getProductCategorys();
  }, []);

  const columns: GridColDef<productCategorySchemaType>[] = [
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
          <IconButton
            onClick={() => row.id !== undefined && delProductCategorys(row.id)}
          >
            <DeleteIcon />
          </IconButton>
          <IconButton onClick={() => row.id !== undefined && putOn(row.id)}>
            <EditIcon />
          </IconButton>
        </div>
      ),
    },
  ];

  const rows = productCategorys.map((categoriaProduto) => ({
    id: categoriaProduto.id,
    categoria: categoriaProduto.categoria,
  }));

  return (
    <Box>
      <MiniDrawer />
      <Box sx={SpaceStyle}>
        <Typography>Categoria Produto </Typography>

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
              <form onSubmit={handleSubmit(postProductCategorys)}>
                <TextField
                  id="outlined-helperText"
                  label="categoriaProduto"
                  helperText={errors.categoria?.message || "Obrigatório"}
                  error={!!errors.categoria}
                  {...register("categoria")}
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
                Editar Categoria Produtos
              </Typography>
              <form onSubmit={handleSubmit(putProductCategorys)}>
                <TextField
                  id="outlined-helperText"
                  label="categoria"
                  helperText={errors.categoria?.message || "Obrigatório"}
                  error={!!errors.categoria}
                  {...register("categoria")}
                />

                <Button
                  type="submit"
                  variant="outlined"
                  startIcon={<DoneIcon />}
                >
                  Alterar
                </Button>
              </form>
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
    </Box>
  );
};

export default CategoriaProduto;
