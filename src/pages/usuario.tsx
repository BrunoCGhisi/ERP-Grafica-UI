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
  Grid,
} from "@mui/material";

import { DataGrid, GridColDef, GridLocaleText } from "@mui/x-data-grid";
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
    setSelectedData(null);
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
    {
      field: "nome",
      headerName: "Nome",
      editable: false,
      flex: 0,
      width: 390,
      headerClassName: "gridHeader--header",
    },
    {
      field: "email",
      headerName: "Email",
      editable: false,
      flex: 0,
      width: 400,
      headerClassName: "gridHeader--header",
    },
    {
      field: "isAdm",
      headerName: "Administrador",
      editable: false,
      flex: 0,
      width: 110,
      headerClassName: "gridHeader--header",
      renderCell: ({ value }) => (value ? "Sim" : "Não"),
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
          {isAdm ? (
            <>
              <IconButton
                onClick={() => row.id !== undefined && handleDelete(row.id)}
              >
                <DeleteIcon />
              </IconButton>
              <IconButton
                onClick={() => row.id !== undefined && handleEdit(row)}
              >
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
              <Typography variant="h6">Usuários</Typography>
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
                <Grid container spacing={2} direction="column">
                  <Grid item>
                    <Typography
                      id="modal-modal-title"
                      variant="h6"
                      component="h2"
                    >
                      Cadastro Usuário
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <form onSubmit={handleSubmit(handleAdd)}>
                      <Grid container spacing={2}>
                        {/* Primeira coluna - Nome e Email */}
                        <Grid item xs={12} md={6}>
                          <TextField
                            id="outlined-helperText"
                            label="Nome"
                            helperText={errors.nome?.message || "Obrigatório"}
                            error={!!errors.nome}
                            fullWidth
                            {...register("nome")}
                          />
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <TextField
                            id="outlined-helperText"
                            label="Email"
                            helperText={errors.email?.message || "Obrigatório"}
                            error={!!errors.email}
                            fullWidth
                            {...register("email")}
                          />
                        </Grid>

                        {/* Segunda coluna - Senha e Select de Administrador */}
                        <Grid item xs={12} md={6}>
                          <TextField
                            id="outlined-helperText"
                            label="Senha"
                            helperText={errors.senha?.message || "Obrigatório"}
                            error={!!errors.senha}
                            fullWidth
                            {...register("senha")}
                          />
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <Controller
                            control={control}
                            name="isAdm"
                            defaultValue={false} // valor booleano padrão
                            render={({ field }) => (
                              <Select
                                {...field}
                                fullWidth
                                displayEmpty
                                inputProps={{
                                  "aria-label": "Adm ou Funcionário",
                                }}
                              >
                                <MenuItem value="" disabled>
                                  Administrador ou
                                </MenuItem>
                                <MenuItem value={true}>Administrador</MenuItem>
                                <MenuItem value={false}>Funcionário</MenuItem>
                              </Select>
                            )}
                          />
                        </Grid>

                        {/* Botão de cadastro */}
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
                <Grid container spacing={2} direction="column">
                  <Grid item>
                    <Typography
                      id="modal-modal-title"
                      variant="h6"
                      component="h2"
                      gutterBottom
                    >
                      Editar Usuário
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <form onSubmit={handleSubmit(handleUpdate)}>
                      <Grid container spacing={2}>
                        <Grid item xs={12}>
                          <TextField
                            id="outlined-helperText"
                            label="Nome"
                            helperText={errors.nome?.message || "Obrigatório"}
                            error={!!errors.nome}
                            {...register("nome")}
                            fullWidth
                          />
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <Controller
                          
                            control={control}
                            name="isAdm"
                            defaultValue={false} // valor booleano padrão
                            render={({ field }) => (
                              <Select
                                {...field}
                                fullWidth
                                displayEmpty
                                inputProps={{
                                  "aria-label": "Adm ou Funcionário",
                                }}
                              >
                                <MenuItem value="" disabled>
                                  Administrador ou
                                </MenuItem>
                                <MenuItem value={true}>Administrador</MenuItem>
                                <MenuItem value={false}>Funcionário</MenuItem>
                              </Select>
                            )}
                          />
                        </Grid>
                        <Grid item xs={12} sx={{ textAlign: "right" }}>
                          <Button
                            type="submit"
                            variant="outlined"
                            startIcon={<DoneIcon />}
                          >
                            Atualizar
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

export default Usuario;
