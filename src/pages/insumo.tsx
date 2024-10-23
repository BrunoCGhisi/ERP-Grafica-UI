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
  Select,
  MenuItem,
} from "@mui/material";

import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { ModalStyle, GridStyle, SpaceStyle } from "../shared/styles";
import { MiniDrawer } from "../shared/components";

import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import DoneIcon from "@mui/icons-material/Done";

import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useOpenModal } from "../shared/hooks/useOpenModal";
import { ModalRoot } from "../shared/components/ModalRoot";

import {
  insumoSchema,
  InsumoDataRow,
  insumoSchemaType,
} from "../shared/services/types";

import {
  getSupplies,
  postSupplie,
  putSupplie,
  deleteSupplie,
} from "../shared/services";

const Insumo = () => {
  const [supplies, setSupplies] = useState<insumoSchemaType[]>([]);
  const [selectedData, setSelectedData] = useState<InsumoDataRow | null>(
    null
  );
  const { open, toggleModal } = useOpenModal();

  const {
    register,
    handleSubmit,
    reset,
    control,
    setValue,
    formState: { errors },
  } = useForm<insumoSchemaType>({
    resolver: zodResolver(insumoSchema),
  });

  // Modal ADD -----------------------------------------------------------------------------------------------------
  const [adopen, setAdOpen] = useState<boolean>(false);
  const addOn = () => {
    setAdOpen(true), reset();
  };
  const addOf = () => setAdOpen(false);

  // População da modal  -----------------------------------------------------------------------------------------------------
  const handleEdit = (updateData: InsumoDataRow) => {
    setSelectedData(updateData);
    toggleModal();
  };

  useEffect(() => {
    if (selectedData) {
      setValue("id", selectedData.id);
      setValue("nome", selectedData.nome);
      setValue("estoque", selectedData.estoque);
      setValue("isActive", selectedData.isActive);
    }
  }, [selectedData, setValue]);

  //CRUD -----------------------------------------------------------------------------------------------------
  const loadSupplies = async () => {
    const productCategoriesData = await getSupplies();
    setSupplies(productCategoriesData);
  };

  const handleAdd = async (data: insumoSchemaType) => {
    await postSupplie(data);
    loadSupplies();
    setAdOpen(false);
  };

  const handleUpdate = async (data: insumoSchemaType) => {
    await putSupplie(data);
    loadSupplies();
    toggleModal();
  };

  const handleDelete = async (id: number) => {
    await deleteSupplie(id);
    loadSupplies();
  };

  useEffect(() => {
    loadSupplies();
  }, [open]);

  const columns: GridColDef<InsumoDataRow>[] = [
    { field: "id", headerName: "ID", align: "left", flex: 0 },
    { field: "nome", headerName: "Nome", editable: false, flex: 0 },
    { field: "estoque", headerName: "Estoque", editable: false, flex: 0 },
    { field: "isActive", headerName: "Ativo", editable: false, flex: 0 },

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

  const rows = supplies.map((supplie) => ({
    id: supplie.id,
    nome: supplie.nome,
    estoque: supplie.estoque,
    isActive: supplie.isActive,
  }));

  return (
    <Box>
      <MiniDrawer>
      <Box sx={SpaceStyle}>
        <Typography>Insumos</Typography>

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
                  label="Nome"
                  helperText={errors.nome?.message || "Obrigatório"}
                  error={!!errors.nome}
                  {...register("nome")}
                />
                <TextField
                  id="outlined-helperText"
                  label="Estoque"
                  helperText={errors.estoque?.message || "Obrigatório"}
                  error={!!errors.estoque}
                  {...register("estoque", { valueAsNumber: true })}
                />

                <Controller
                name="isActive"
                control={control}
                defaultValue={false}
                render={({field}) => (
                    <Select
                    onChange={field.onChange}
                    value={field.value}
                    >
                        <MenuItem value={true}>Ativo</MenuItem>
                        <MenuItem value={false}>Desativado</MenuItem>

                    </Select>)}/>

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
                  label="Nome"
                  helperText={errors.nome?.message || "Obrigatório"}
                  error={!!errors.nome}
                  {...register("nome")}
                />
                <TextField
                  id="outlined-helperText"
                  label="Estoque"
                  helperText={errors.estoque?.message || "Obrigatório"}
                  error={!!errors.estoque}
                  {...register("estoque", { valueAsNumber: true })}
                />

                <Controller
                name="isActive"
                control={control}
                defaultValue={false}
                render={({field}) => (
                    <Select
                    onChange={field.onChange}
                    value={field.value}
                    >
                        <MenuItem value={true}>Ativo</MenuItem>
                        <MenuItem value={false}>Desativado</MenuItem>

                    </Select>)}/>

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
      </MiniDrawer>
    </Box>
  );
};

export default Insumo;
