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

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const bancoSchema = z.object({
  id: z.number().optional(),
  nome: z.string(),
  valorTotal: z.number(),
});

type bancoSchemaType = z.infer<typeof bancoSchema>;

const Banco = () => {
  const [banks, setBanks] = useState<bancoSchemaType[]>([]);

  // Modal ADD -----------------------------------------------------------------------------------------------------
  const [adopen, setAdOpen] = useState<boolean>(false);
  const addOn = () => setAdOpen(true);
  const addOf = () => setAdOpen(false);

  // Modal PUT -----------------------------------------------------------------------------------------------------
  const [popen, setPOpen] = useState<boolean>(false);
  const putOn = (id: number) => {
    const bancosFilter = banks.filter(
      (banco: bancoSchemaType) => banco.id === id
    );
    if (bancosFilter.length > 0) {
      setValue("nome", bancosFilter[0].nome);
      setValue("valorTotal", bancosFilter[0].valorTotal);
      setValue("id", bancosFilter[0].id);
      setPOpen(true);
    }
  };
  const putOf = () => setPOpen(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<bancoSchemaType>({
    resolver: zodResolver(bancoSchema),
  });

  


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
    try {
      const response = await axios.post("http://localhost:3000/banco", data);
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
      putOf();
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

  const columns: GridColDef<bancoSchemaType>[] = [
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
          <IconButton onClick={() => row.id !== undefined && putOn(row.id)}>
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
                  type="submit" // colcoar esse putbanks no form, tipar para submit
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

export default Banco;
