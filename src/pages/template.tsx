import { useState, useEffect } from "react";
import { UserVO } from "../shared/services/types";
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
import { ModalStyle, GridStyle, SpaceStyle } from "./styles";
import { MiniDrawer } from "../shared/components";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import DoneIcon from "@mui/icons-material/Done";

const Template = () => {
  const [users, setUsers] = useState<UserVO[]>([]);
  const [userId, setUserId] = useState<string>("");
  const [nome, setNome] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [senha, setSenha] = useState<string>("");
  const [isAdm, setIsAdm] = useState<string>("");

  // Modal ADD
  const [adopen, setAdOpen] = useState<boolean>(false);
  const addOn = () => setAdOpen(true);
  const addOf = () => setAdOpen(false);

  // Modal PUT
  const [popen, setPOpen] = useState<boolean>(false);
  const putOn = (
    id: string,
    nome: string,
    email: string,
    senha: string,
    isAdm: string
  ) => {
    setUserId(id);
    setNome(nome);
    setEmail(email);
    setSenha(senha);
    setIsAdm(isAdm);
    setPOpen(true);
  };
  const putOf = () => setPOpen(false);

  async function getUsers() {
    try {
      const response = await axios.get("http://localhost:3000/usuario");
      setUsers(response.data.usuarios);
    } catch (error: any) {
      console.error(error);
    }
  }

  async function postUsers() {
    try {
      const response = await axios.post("http://localhost:3000/usuario", {
        nome: nome,
        email: email,
        senha: senha,
        isAdm: isAdm,
      });
      if (response.status === 200) alert("Usuário cadastrado com sucesso!");
      getUsers();
    } catch (error: any) {
      console.error(error);
    } finally {
      addOf();
    }
  }

  async function putUsers() {
    try {
      const response = await axios.put(
        `http://localhost:3000/usuario?id=${userId}`,
        {
          nome: nome,
          email: email,
          senha: senha,
          isAdm: isAdm,
        }
      );
      if (response.status === 200) alert("Usuário atualizado com sucesso!");
      getUsers();
    } catch (error: any) {
      console.error(error);
    } finally {
      putOf();
    }
  }

  async function delUsers(id: string) {
    try {
      const response = await axios.delete(
        `http://localhost:3000/usuario?id=${id}`
      );
      if (response.status === 200) alert("Usuário deletado com sucesso!");
      getUsers();
    } catch (error: any) {
      console.error(error);
    }
  }

  useEffect(() => {
    getUsers();
  }, []);

  const columns: GridColDef<UserVO>[] = [
    { field: "id", headerName: "ID", align: "left", flex: 0 },
    { field: "nome", headerName: "Nome", editable: false, flex: 0 },
    { field: "email", headerName: "Email", editable: false, flex: 0 },
    { field: "isAdm", headerName: "isAdm", editable: false, flex: 0 },
    {
      field: "acoes",
      headerName: "Ações",
      width: 150,
      align: "center",
      type: "actions",
      flex: 0,
      renderCell: ({ row }) => (
        <div>
          <IconButton onClick={() => delUsers(row.id)}>
            <DeleteIcon />
          </IconButton>
          <IconButton
            onClick={() =>
              putOn(row.id, row.nome, row.email, row.senha, row.isAdm)
            }
          >
            <EditIcon />
          </IconButton>
        </div>
      ),
    },
  ];

  const rows = users.map((usuario) => ({
    id: usuario.id,
    nome: usuario.nome,
    email: usuario.email,
    senha: usuario.senha,
    isAdm: usuario.isAdm ? "Sim" : "Não",
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
              <TextField
                id="outlined-helperText"
                label="Nome"
                helperText="Obrigatório"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
              />
              <TextField
                id="outlined-helperText"
                label="Email"
                helperText="Obrigatório"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <TextField
                id="outlined-helperText"
                label="IsAdm"
                helperText="Obrigatório"
                value={isAdm}
                onChange={(e) => setIsAdm(e.target.value)}
              />
              <TextField
                id="outlined-helperText"
                label="Senha"
                type="password" // Corrigido para senha
                helperText="Obrigatório"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
              />
              <Button
                onClick={postUsers}
                variant="outlined"
                startIcon={<DoneIcon />}
              >
                Cadastrar
              </Button>
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
                Editar Usuário
              </Typography>
              <TextField
                id="outlined-helperText"
                label="Nome"
                helperText="Obrigatório"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
              />
              <TextField
                id="outlined-helperText"
                label="Email"
                helperText="Obrigatório"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <TextField
                id="outlined-helperText"
                label="Senha"
                type="password" // Corrigido para senha
                helperText="Obrigatório"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
              />
              <TextField
                id="outlined-helperText"
                label="IsAdm"
                helperText="Obrigatório"
                value={isAdm}
                onChange={(e) => setIsAdm(e.target.value)}
              />
              <Button
                onClick={putUsers}
                variant="outlined"
                startIcon={<DoneIcon />}
              >
                Alterar
              </Button>
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

export default Template;
