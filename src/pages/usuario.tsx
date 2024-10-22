import { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Modal,
  InputLabel,
  Select,
  Button,
  Typography,
  TextField,
  Stack,
  IconButton,
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
  usuarioSchema,
  UsuarioDataRow,
  usuarioSchemaType,
} from "../shared/services/types";

import { getUsers, postUser, putUser, deleteUser } from "../shared/services";

import { getToken } from "../shared/services/payload";



const Usuario = () => {
  const [user, setUser] = useState<usuarioSchemaType[]>([]);
  const [selectedData, setSelectedData] = useState<UsuarioDataRow | null>(null);
  const { open, toggleModal } = useOpenModal();

  const [userId, setUserId] = useState<number | null>(null); 
  const [nome, setNome] = useState<string | null>(null); 
  const [isAdm, setIsAdm] = useState<boolean | null>(null); 

  const {
    register,
    handleSubmit,
    reset,
    control,
    setValue,
    formState: { errors },
  } = useForm<usuarioSchemaType>({
    resolver: zodResolver(usuarioSchema),
  });

  // Modal ADD -----------------------------------------------------------------------------------------------------
  const [adopen, setAdOpen] = useState<boolean>(false);
  const addOn = () => {
    setAdOpen(true), reset();
  };
  const addOf = () => setAdOpen(false);

  // População da modal  -----------------------------------------------------------------------------------------------------
  const handleEdit = (updateData: UsuarioDataRow) => {
    setSelectedData(updateData);
    toggleModal();
  };

  useEffect(() => {
    if (selectedData) {
      setValue("id", selectedData.id);
      setValue("nome", selectedData.nome);
      setValue("email", selectedData.email);
      setValue("senha", selectedData.senha);
      setValue("isAdm", selectedData.isAdm);
    }
  }, [selectedData, setValue]);

  //CRUD -----------------------------------------------------------------------------------------------------
  const loadUsers = async () => {
    const usersData = await getUsers();
    setUser(usersData);
  };

  const handleAdd = async (data: usuarioSchemaType) => {
    await postUser(data);
    loadUsers();
    setAdOpen(false);
  };

  const handleUpdate = async (data: usuarioSchemaType) => {
    await putUser(data);
    loadUsers();
    toggleModal();
  };

  const handleDelete = async (id: number) => {
    await deleteUser(id);
    loadUsers();
  };

  useEffect(() => {
    loadUsers();
  }, [open]);

  useEffect(() => {
    const fetchToken = async () => {
      const tokenData = await getToken();
      if (tokenData) {
        setUserId(tokenData.userId);
        setNome(tokenData.nome);
        setIsAdm(tokenData.isAdm);
      }
    };
    fetchToken();
  }, []);

  const columns: GridColDef<UsuarioDataRow>[] = [
    { field: "id", headerName: "ID", align: "left", flex: 0 },
    { field: "nome", headerName: "Nome", editable: false, flex: 0 },
    { field: "email", headerName: "Email", editable: false, flex: 0 },
    { field: "senha", headerName: "Senha", editable: false, flex: 0 },
    { field: "isAdm", headerName: "Adm", editable: false, flex: 0 },
    {
      field: "acoes",
      headerName: "Ações",
      width: 150,
      align: "center",
      type: "actions",
      flex: 0,
      renderCell: ({ row }) => (
        <div>
          {isAdm ? (
  <>
    <IconButton onClick={() => row.id !== undefined && handleDelete(row.id)}>
      <DeleteIcon />
    </IconButton>
    <IconButton onClick={() => row.id !== undefined && handleEdit(row)}>
      <EditIcon />
    </IconButton>
  </>
) : null}
          
        </div>
      ),
    },
  ];
  const rows = user.map((usuario) => ({
    id: usuario.id,
    nome: usuario.nome,
    email: usuario.email,
    senha: usuario.senha,
    isAdm: usuario.isAdm,
  }));

  return (
    <Box>
      <MiniDrawer />
      <Box sx={SpaceStyle}>
        <Typography>Usuários</Typography>
        
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
                Novo usuário
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
                  label="Email"
                  helperText={errors.email?.message || "Obrigatório"}
                  error={!!errors.email}
                  {...register("email")}
                />
                <TextField
                  id="outlined-helperText"
                  label="Senha"
                  helperText={errors.senha?.message || "Obrigatório"}
                  error={!!errors.senha}
                  {...register("senha")}
                />
                <InputLabel id="demo-simple-select-label">
                  Adm ou Funcionário
                </InputLabel>
                <Controller
                  control={control}
                  name="isAdm"
                  defaultValue={false}
                  render={({ field }) => (
                    <Select onChange={field.onChange} value={field.value}>
                      <MenuItem value={true}>Administrador</MenuItem>
                      <MenuItem value={false}>Funcionário</MenuItem>
                    </Select>
                  )}
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
            <ModalRoot title="Editando Nome">
              <form onSubmit={handleSubmit(handleUpdate)}>
                <TextField
                  id="outlined-helperText"
                  label="Nome"
                  helperText={errors.nome?.message || "Obrigatório"}
                  error={!!errors.nome}
                  {...register("nome")}
                />
                
                <InputLabel id="demo-simple-select-label">
                  Adm ou Funcionário
                </InputLabel>

                <Controller
                  control={control}
                  name="isAdm"
                  defaultValue={false}
                  render={({ field }) => (
                    <Select onChange={field.onChange} value={field.value}>
                      <MenuItem value={true}>Administrador </MenuItem>
                      <MenuItem value={false}>Funcionário </MenuItem>
                    </Select>
                  )}
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

export default Usuario;
