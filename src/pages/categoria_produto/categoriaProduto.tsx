import { useState, useEffect } from "react";
import {
  Box,
  Modal,
  Button,
  Typography,
  TextField, IconButton,
  Grid,
  Select,
  MenuItem,
  Alert
} from "@mui/material";

import { DataGrid, GridColDef, GridLocaleText } from "@mui/x-data-grid";
import { GridStyle, ModalStyle, SpaceStyle } from "../../shared/styles";

import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import DoneIcon from "@mui/icons-material/Done";
import { MiniDrawer } from "../../shared/components";
import ArchiveIcon from "@mui/icons-material/Archive";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useOpenModal } from "../../shared/hooks/useOpenModal";
import { ModalRoot } from "../../shared/components/ModalRoot";

import {
  proCategorySchema,
  ProductCategoryDataRow,
  proCategorySchemaType,
  produtoSchemaType,
} from "../../shared/services/types";

import {
  getCategories,
  postCategories,
  putCategories,
  deleteCategories,
  getProducts,
} from "../../shared/services";
import { ModalDeactivateCatProd } from "./components/modal-deactivate.catprod";
import { ModalEditCategoria } from "./components/modal-edit-catprod";

const CategoriaProduto = () => {
  const [productCategorys, setProductCategorys] = useState<
    proCategorySchemaType[]
  >([]);
  const { open, toggleModal } = useOpenModal();
  const toggleModalDeactivate = useOpenModal();
  const [idToEdit, setIdToEdit] = useState<any>(null);
  const [alertMessage, setAlertMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
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

  // CRUD ----------------------------------------------------------------------------------------------------------------------------
  const loadProductCategories = async () => {
    const productCategoriesData = await getCategories();
    setProductCategorys(productCategoriesData);
  };

  const handleAdd = async (data: proCategorySchemaType) => {
    const response = await postCategories(data);
    if (response) {
      setAlertMessage(`${response.data}`);
      setShowAlert(true);
      setTimeout(() => {
        setShowAlert(false);
      }, 5000);
    }
    loadProductCategories();
    setAdOpen(false);
  };

  const handleDelete = async (data: proCategorySchemaType) => {
    const produtos = await getProducts();
    const filterProdutos = produtos.filter(
      (produto: produtoSchemaType) => produto.idInsumo === data.id
    );
    if (filterProdutos.length === 0) {
      await deleteCategories(data.id!);
    } else {
      const deactivate = { ...data, isActive: false };
      await putCategories(deactivate);
    }    
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
            onClick={() => row.id !== undefined && handleDelete(row)}
          >
            <DeleteIcon />
          </IconButton>
          <IconButton onClick={() => row.id !== undefined && [setIdToEdit(row.id), toggleModal()]}>
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
               
                  <Button
                    onClick={toggleModalDeactivate.toggleModal}
                    variant="outlined"
                    startIcon={<ArchiveIcon />}
                  >
                    Arquivados
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
            {open && (
            <ModalEditCategoria
              open={open}
              toggleModal={toggleModal}
              loadProductCategories={loadProductCategories}
              setAlertMessage={setAlertMessage}
              setShowAlert={setShowAlert}
              categorias={productCategorys}
              idToEdit={idToEdit}
            />
            )}
            {toggleModalDeactivate.open && (
              <ModalDeactivateCatProd
                open={toggleModalDeactivate.open}
                toggleModal={toggleModalDeactivate.toggleModal}
                loadProductCategories={loadProductCategories}
              />
            )}
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
      {showAlert && <Alert severity="info">{alertMessage}</Alert>}
    </Box>
  );
};

export default CategoriaProduto;
