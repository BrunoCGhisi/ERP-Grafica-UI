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
  paymentSchema,
  FormaPgtoDataRow,
  paymentSchemaType,
} from "../shared/services/types";

import {
  getPaymentWays,
  postPaymentWays,
  putPaymentWays,
  deletePaymentWays,
} from "../shared/services";

const FormaPgto = () => {
  const [paymentWays, setPaymentWays] = useState<paymentSchemaType[]>([]);
  const [selectedData, setSelectedData] = useState<FormaPgtoDataRow | null>(null);
  const { open, toggleModal } = useOpenModal();

  const {
    register,
    handleSubmit,
    reset,
    control,
    setValue,
    formState: { errors },
  } = useForm<paymentSchemaType>({
    resolver: zodResolver(paymentSchema),
  });

  // Modal ADD -----------------------------------------------------------------------------------------------------
  const [adopen, setAdOpen] = useState<boolean>(false);
  const addOn = () => {
    setAdOpen(true), reset();
  };
  const addOf = () => setAdOpen(false);

  // População da modal  -----------------------------------------------------------------------------------------------------
  const handleEdit = (updateData: FormaPgtoDataRow) => {
    setSelectedData(updateData);
    toggleModal();
  };

  useEffect(() => {
    if (selectedData) {
      setValue("id", selectedData.id);
      setValue("tipo", selectedData.tipo);
      setValue("idBanco", selectedData.idBanco);
    }
  }, [selectedData, setValue]);

  //CRUD -----------------------------------------------------------------------------------------------------
  const loadPaymentWays = async () => {
    const productCategoriesData = await getPaymentWays();
    setPaymentWays(productCategoriesData);
  };

  const handleAdd = async (data: paymentSchemaType) => {
    await postPaymentWays(data);
    loadPaymentWays();
    setAdOpen(false);
  };

  const handleUpdate = async (data: paymentSchemaType) => {
    await putPaymentWays(data);
    loadPaymentWays();
    toggleModal();
  };

  const handleDelete = async (id: number) => {
    await deletePaymentWays(id);
    loadPaymentWays();
  };

  useEffect(() => {
    loadPaymentWays();
  }, [open]);

  const columns: GridColDef<FormaPgtoDataRow>[] = [
    { field: "id", headerName: "ID", align: "left", flex: 0 },
    { field: "tipo", headerName: "Tipo", editable: false, flex: 0 },
    { field: "idBanco", headerName: "IdBanco", editable: false, flex: 0 },

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

  const rows = paymentWays.map((forma_pgto) => ({
    id: forma_pgto.id,
    tipo: forma_pgto.tipo,
    idBanco: forma_pgto.idBanco,
  }));

  return (
    <Box>
      <MiniDrawer> 
      <Box sx={SpaceStyle}>
        <Typography>Formas Pagamento </Typography>
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
                  label="Tipo"
                  helperText={errors.tipo?.message || "Obrigatório"}
                  error={!!errors.tipo}
                  {...register("tipo")}
                />
                <TextField
                  id="outlined-helperText"
                  label="idBanco"
                  helperText={errors.idBanco?.message || "Obrigatório"}
                  error={!!errors.idBanco}
                  {...register("idBanco", { valueAsNumber: true })}
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
            <ModalRoot title="Editando Formas de Pagamento">
              <form onSubmit={handleSubmit(handleUpdate)}>
                <TextField
                  id="outlined-helperText"
                  label="Tipo"
                  helperText={errors.tipo?.message || "Obrigatório"}
                  error={!!errors.tipo}
                  {...register("tipo")}
                />
                <TextField
                  id="outlined-helperText"
                  label="idBanco"
                  helperText={errors.idBanco?.message || "Obrigatório"}
                  error={!!errors.idBanco}
                  {...register("idBanco", { valueAsNumber: true })}
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
      </MiniDrawer>
    </Box>
  );
};

export default FormaPgto;
