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

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const formaPgtoSchema = z.object({
  id: z.number().optional(),
  tipo: z.string(),
  idBanco: z.number().optional(),
});

type formaPgtoSchemaType = z.infer<typeof formaPgtoSchema>;

const FormaPgto = () => {
  const [paymentWays, setPaymentWays] = useState<formaPgtoSchemaType[]>([]);

  // Modal ADD
  const [adopen, setAdOpen] = useState<boolean>(false);
  const addOn = () => setAdOpen(true);
  const addOf = () => setAdOpen(false);

  // Modal PUT
  const [popen, setPOpen] = useState<boolean>(false);
  const putOn = (id: number) => {
    console.log("cheguei aqui", id);
    const formasPgtoFilter = paymentWays.filter(
      (formaPgto: formaPgtoSchemaType) => formaPgto.id === id
    );
    if (formasPgtoFilter.length > 0) {
      setValue("tipo", formasPgtoFilter[0].tipo);
      setValue("idBanco", formasPgtoFilter[0].idBanco);
      setValue("id", formasPgtoFilter[0].id);
      setPOpen(true);
    }
  };
  const putOf = () => setPOpen(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<formaPgtoSchemaType>({
    resolver: zodResolver(formaPgtoSchema),
  });

  //CRUD -----------------------------------------------------------------------------------------------------
  async function getPaymentWays() {
    try {
      const response = await axios.get("http://localhost:3000/forma_pgto");
      setPaymentWays(response.data.formas_pgto);
    } catch (error: any) {
      console.error(error);
    }
  }

  async function postPaymentWays(data: formaPgtoSchemaType) {
    try {
      const response = await axios.post(
        "http://localhost:3000/forma_pgto",
        data
      );
      console.log("cheguei aqui");
      if (response.status === 200) alert("forma_pgto cadastrado com sucesso!");
      getPaymentWays();
    } catch (error: any) {
      console.error(error);
    } finally {
      addOf();
    }
  }

  async function putPaymentWays(data: formaPgtoSchemaType) {
    console.log("Dados enviados para atualização:", data);
    try {
      const response = await axios.put(
        `http://localhost:3000/forma_pgto?id=${data.id}`,
        data
      );
      if (response.status === 200) alert("Usuário atualizado com sucesso!");
      getPaymentWays();
    } catch (error: any) {
      console.error(error);
    } finally {
      putOf();
    }
  }

  async function delPaymentWays(id: number) {
    try {
      const response = await axios.delete(
        `http://localhost:3000/forma_pgto?id=${id}`
      );
      if (response.status === 200) alert("forma_pgto deletado com sucesso!");
      getPaymentWays();
    } catch (error: any) {
      console.error(error);
    }
  }

  useEffect(() => {
    getPaymentWays();
  }, []);

  const columns: GridColDef<formaPgtoSchemaType>[] = [
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
            onClick={() => row.id !== undefined && delPaymentWays(row.id)}
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

  const rows = paymentWays.map((forma_pgto) => ({
    id: forma_pgto.id,
    tipo: forma_pgto.tipo,
    idBanco: forma_pgto.idBanco,
  }));

  return (
    <Box>
      <MiniDrawer />
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

              <form onSubmit={handleSubmit(postPaymentWays)}>
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
              <form onSubmit={handleSubmit(putPaymentWays)}>
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

export default FormaPgto;
