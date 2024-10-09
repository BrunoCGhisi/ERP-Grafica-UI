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

const bancoSchema = z.object({
  id: z.number().optional(),
  nome: z.string(),
  valorTotal: z.number(),
});

interface dataRow {
  id: number;
  nome: string;
  valorTotal: number;
}

type bancoSchemaType = z.infer<typeof bancoSchema>;

const Banco = () => {
  const [selectedData, setSelectedData] = useState<dataRow | null>(null);
  const [banks, setBanks] = useState<bancoSchemaType[]>([]);
  const { open, toggleModal } = useOpenModal();

  const {
    register,
    handleSubmit,
    reset,
    control,
    setValue,
    formState: { errors },
  } = useForm<bancoSchemaType>({
    resolver: zodResolver(bancoSchema),
  });

  // Modal ADD -----------------------------------------------------------------------------------------------------
  const [adopen, setAdOpen] = useState<boolean>(false);
  const addOn = () => {
    setAdOpen(true), reset();
  };
  const addOf = () => setAdOpen(false);

  // População da Modal ----------------------------

  const handleEdit = (updateData: dataRow) => {
    setSelectedData(updateData);
    toggleModal();
  };

  useEffect(() => {
    if (selectedData) {
      setValue("id", selectedData.id);
      setValue("nome", selectedData.nome);
      setValue("valorTotal", selectedData.valorTotal);
    }
  }, [selectedData, setValue]);

  //CRUD -----------------------------------------------------------------------------------------------------
  async function getBanks() {
    try {
      const response = await axios.get("http://localhost:3000/banco");
      setBanks(response.data.bancos);
    } catch (error: any) {
      console.error(error);
    }
  }

  async function postBanks(data: bancoSchemaType) {
    const { id, ...mydata } = data;

    try {
      const response = await axios.post("http://localhost:3000/banco", mydata);
      if (response.status === 200) alert("Banco cadastrado com sucesso!");
      getBanks();
    } catch (error: any) {
      console.error(error);
    } finally {
      addOf();
    }
  }

  async function putBanks(data: bancoSchemaType) {
    try {
      const response = await axios.put(
        `http://localhost:3000/banco?id=${data.id}`,
        data
      );
      if (response.status === 200) alert("Usuário atualizado com sucesso!");
      getBanks();
    } catch (error: any) {
      console.error(error);
    } finally {
      toggleModal();
    }
  }

  async function delBanks(id: number) {
    try {
      const response = await axios.delete(
        `http://localhost:3000/banco?id=${id}`
      );
      if (response.status === 200) alert("Banco deletado com sucesso!");
      getBanks();
    } catch (error: any) {
      console.error(error);
    }
  }

  useEffect(() => {
    getBanks();
  }, []);

  useEffect(() => {
    getBanks();
  }, [open]);

  const columns: GridColDef<dataRow>[] = [
    { field: "id", headerName: "ID", align: "left", flex: 0 },
    { field: "nome", headerName: "Nome", editable: false, flex: 0 },
    { field: "valorTotal", headerName: "valorTotal", editable: false, flex: 0 },

    {
      field: "acoes",
      headerName: "Ações",
      width: 150,
      align: "center",
      type: "actions",
      flex: 0,
      renderCell: ({ row }) => (
        <div>
          <IconButton onClick={() => row.id !== undefined && delBanks(row.id)}>
            <DeleteIcon />
          </IconButton>
          <IconButton onClick={() => row.id !== undefined && handleEdit(row)}>
            <EditIcon />
          </IconButton>
        </div>
      ),
    },
  ];

  const rows = banks.map((banco) => ({
    id: banco.id,
    nome: banco.nome,
    valorTotal: banco.valorTotal,
  }));

  return (
    <Box>
      <MiniDrawer />
      <Box sx={SpaceStyle}>
        <Typography>Estamos dentro do banco </Typography>
        <Typography>(Não iremos cometer nenhum assalto...)</Typography>
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
              <form onSubmit={handleSubmit(postBanks)}>
                <TextField
                  id="outlined-helperText"
                  label="Nome"
                  helperText={errors.nome?.message || "Obrigatório"}
                  error={!!errors.nome}
                  {...register("nome")}
                />
                <TextField
                  id="outlined-helperText"
                  label="valorTotal"
                  helperText={errors.valorTotal?.message || "Obrigatório"}
                  error={!!errors.valorTotal}
                  {...register("valorTotal", { valueAsNumber: true })}
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
              <form onSubmit={handleSubmit(putBanks)}>
                <TextField
                  id="outlined-helperText"
                  label="Nome"
                  helperText={errors.nome?.message || "Obrigatório"}
                  error={!!errors.nome}
                  {...register("nome")}
                />
                <TextField
                  id="outlined-helperText"
                  label="valorTotal"
                  helperText={errors.valorTotal?.message || "Obrigatório"}
                  error={!!errors.valorTotal}
                  {...register("valorTotal", { valueAsNumber: true })}
                />
                <Button
                  type="submit"
                  variant="outlined"
                  startIcon={<DoneIcon />}
                >
                  Atualizar
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

export default Banco;
