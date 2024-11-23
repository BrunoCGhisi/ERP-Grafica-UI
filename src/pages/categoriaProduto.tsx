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
  Grid,
  Divider,
} from "@mui/material";

import { DataGrid, GridColDef, GridLocaleText } from "@mui/x-data-grid";
import { GridStyle, ModalStyle, SpaceStyle } from "../shared/styles";

import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import DoneIcon from "@mui/icons-material/Done";
import { MiniDrawer } from "../shared/components";

import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useOpenModal } from "../shared/hooks/useOpenModal";
import { ModalRoot } from "../shared/components/ModalRoot";

import {
  proCategorySchema,
  ProductCategoryDataRow,
  proCategorySchemaType,
} from "../shared/services/types";

import {
  getCategories,
  postCategories,
  putCategories,
  deleteCategories,
} from "../shared/services";

const CategoriaProduto = () => {
  const [productCategorys, setProductCategorys] = useState<
    proCategorySchemaType[]
  >([]);
  const [selectedData, setSelectedData] =
    useState<ProductCategoryDataRow | null>(null);
  const { open, toggleModal } = useOpenModal();

  const {
    register,
    handleSubmit,
    reset,
    control,
    setValue,
    formState: { errors },
  } = useForm<proCategorySchemaType>({
    resolver: zodResolver(proCategorySchema),
  });

  // Modal ADD -----------------------------------------------------------------------------------------------------
  const [adopen, setAdOpen] = useState<boolean>(false);
  const addOn = () => {
    setAdOpen(true), reset();
  };
  const addOf = () => setAdOpen(false);

  // População da modal  -----------------------------------------------------------------------------------------------------
  const handleEdit = (updateData: ProductCategoryDataRow) => {
    setSelectedData(updateData);
    toggleModal();
  };

  useEffect(() => {
    if (selectedData) {
      setValue("id", selectedData.id);
      setValue("categoria", selectedData.categoria);
    }
  }, [selectedData, setValue]);

  // CRUD ----------------------------------------------------------------------------------------------------------------------------
  const loadProductCategories = async () => {
    const productCategoriesData = await getCategories();
    setProductCategorys(productCategoriesData);
  };

  const handleAdd = async (data: proCategorySchemaType) => {
    await postCategories(data);
    loadProductCategories();
    setAdOpen(false);
  };

  const handleUpdate = async (data: proCategorySchemaType) => {
    await putCategories(data);
    loadProductCategories();
    toggleModal();
  };

  const handleDelete = async (id: number) => {
    await deleteCategories(id);
    loadProductCategories();
  };

  useEffect(() => {
    loadProductCategories();
  }, [open]);

  // GRID ------------------------------------------------

  const columns: GridColDef<ProductCategoryDataRow>[] = [
    {
      field: "categoria",
      headerName: "Categoria",
      editable: false,
      flex: 0,
      width: 900,
      headerClassName: "gridHeader--header",
    },
    {
      field: "acoes",
      headerName: "Ações",
      width: 150,
      align: "center",
      type: "actions",
      flex: 0,
      headerClassName: "gridHeader--header",
      renderCell: ({ row }) => (
        <div>
          <IconButton
            onClick={() => row.id !== undefined && handleDelete(row.id)}
          >
            <DeleteIcon />
          </IconButton>
          <IconButton onClick={() => row.id !== undefined && handleEdit(row)}>
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

  const localeText: Partial<GridLocaleText> = {
    toolbarDensity: "Densidade",
    toolbarColumns: "Colunas",
    footerRowSelected: (count) => "", // Remove a mensagem "One row selected"
  };

  return (
    <Box>
      <MiniDrawer>
        <Box sx={SpaceStyle}>
          <Grid
            container
            spacing={2}
            justifyContent="space-between"
            alignItems="center"
          >
            <Grid item>
              <Typography variant="h6">Categorias de Produtos</Typography>
            </Grid>

            <Grid item>
              <Button
                onClick={addOn}
                variant="outlined"
                startIcon={<AddCircleOutlineIcon />}
              >
                Cadastrar
              </Button>
            </Grid>
          </Grid>
          <Box>
            <Modal
              open={adopen}
              onClose={addOf}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Box sx={ModalStyle}>
                <Grid container spacing={2}>
                  <Grid item>
                    <Typography
                      id="modal-modal-title"
                      variant="h6"
                      component="h2"
                    >
                      Cadastro Categoria de Produto
                    </Typography>
                  </Grid>
            
                  <Grid item xs={12}>
                    <form onSubmit={handleSubmit(handleAdd)}>
                      <Grid container spacing={2}>
                        <Grid item xs={12} md={8}>
                          <TextField
                            fullWidth 
                            id="outlined-helperText"
                            label="Categoria Produto"
                            helperText={
                              errors.categoria?.message || "Obrigatório"
                            }
                            error={!!errors.categoria}
                            {...register("categoria")}
      
                          />
                        </Grid>

                        <Grid item xs={12} sx={{ textAlign: "right" }}>
                          <Button
                            type="submit"
                            variant="outlined"
                            startIcon={<DoneIcon />}
                          >
                            Cadastrar
                          </Button>
                        </Grid>
                      </Grid>
                    </form>
                  </Grid>
                </Grid>
              </Box>
            </Modal>
            {/* ---------UPDATE----------------------------------------------------------------------------------------------------------- */}
            <Modal
              open={open}
              onClose={toggleModal}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <ModalRoot>
              <Grid container spacing={2}>
                  <Grid item>
                    <Typography
                      id="modal-modal-title"
                      variant="h6"
                      component="h2"
                    >
                      Atualizar
                    </Typography>
                  </Grid>
            
                  <Grid item xs={12}>
                    <form onSubmit={handleSubmit(handleUpdate)}>
                      <Grid container spacing={2}>
                        <Grid item xs={12} md={8}>
                          <TextField
                            id="outlined-helperText"
                            label="Categoria Produto"
                            helperText={
                              errors.categoria?.message || "Obrigatório"
                            }
                            error={!!errors.categoria}
                            {...register("categoria")}
                            fullWidth 
                          />
                        </Grid>

                        <Grid item xs={12} sx={{ textAlign: "right" }}>
                          <Button
                            type="submit"
                            variant="outlined"
                            startIcon={<DoneIcon />}
                          >
                            Editar
                          </Button>
                        </Grid>
                      </Grid>
                    </form>
                  </Grid>
                </Grid>
              </ModalRoot>
            </Modal>
          </Box>
          <Box sx={GridStyle}>
            <DataGrid
              rows={rows}
              columns={columns}
              localeText={localeText}
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
      </MiniDrawer>
    </Box>
  );
};

export default CategoriaProduto;
