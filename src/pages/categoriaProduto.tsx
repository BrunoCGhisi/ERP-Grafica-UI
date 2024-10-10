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
  productCategorySchema,
  ProductCategoryDataRow,
  productCategorySchemaType,
} from "../shared/services/types";

import {
  getCategories,
  postCategories,
  putCategories,
  deleteCategories,
} from "../shared/services";
const CategoriaProduto = () => {
  const [productCategorys, setProductCategorys] = useState<
    productCategorySchemaType[]
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
  } = useForm<productCategorySchemaType>({
    resolver: zodResolver(productCategorySchema),
  });

  // Modal ADD -----------------------------------------------------------------------------------------------------
  const [adopen, setAdOpen] = useState<boolean>(false);
  const addOn = () => {
    setAdOpen(true), reset();
  };
  const addOf = () => setAdOpen(false);

  // População da modal  --------------------------------
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

  const handleAdd = async (data: productCategorySchemaType) => {
    await postCategories(data);
    loadProductCategories();
    setAdOpen(false);
  };

  const handleUpdate = async (data: productCategorySchemaType) => {
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
              <form onSubmit={handleSubmit(handleAdd)}>
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
          {/* ---------UPDATE----------------------------------------------------------------------------------------------------------- */}
          <Modal
            open={open}
            onClose={toggleModal}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <ModalRoot>
              <form onSubmit={handleSubmit(handleUpdate)}>
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

export default CategoriaProduto;
