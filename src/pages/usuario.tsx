import React, { useState, useEffect } from "react";

import { UserVO } from "../services/types";

import axios from "axios";

import {
    Accordion,
    AccordionDetails,
    Box,
    Modal,
    AccordionSummary,
    Button,
    Divider,
    IconButton,
    Stack,
    TextField,
    Typography,
  } from "@mui/material";

  import { DataGrid, GridColDef } from "@mui/x-data-grid";

  //Icones
  import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
  import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
  import DeleteIcon from "@mui/icons-material/Delete";
  import EditIcon from "@mui/icons-material/Edit";
  import DoneIcon from "@mui/icons-material/Done";

const Usuario = () => {
    const [users, setUsers] = useState<UserVO[]>([]);
    const [userId, setUserId] = useState("");

    const [nome, setNome] = useState("")
    const [email, setEmail] = useState("")
    const [senha, setSenha] = useState("")
    const [isAdm, setIsAdm] = useState("")
    
    //Modal Put
    const [popen, setPOpen] = React.useState(false);
    const putOn = (id: string, nome: string, email: string, senha: string) => {
      setNome(nome);
      setNome(email);
      setNome(senha);
      setUserId(id);
      setPOpen(true);
    };
    const putOf = () => setPOpen(false);


    async function getUsers() {
      try { 
        const response = await axios.get("http://localhost:3000/usuario"); //VERIFICAR SE O NOME TA CERTO
        setUsers(response.data.usuarios); // aqui pe o nome que vem do back antona burra
      } catch (error: any) {
        new Error(error);
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
        getUsers();
        if (response.status === 200) alert("Usuario cadastro com sucesso!");
      } catch (error: any) {
        new Error(error);
      } finally {
        
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
            isAdm: isAdm
          }
        );
        if (response.status === 200) alert("Usuario atualizado com sucesso!");
        getUsers();
      } catch (error: any) {
        new Error(error);
      } finally {
        putOf();
      }
    }

    async function delUsers(id: string) {
      try {
        const response = await axios.delete(
          `http://localhost:3000/usuario?id=${id}`
        );
        getUsers();
        if (response.status === 200) alert("Usuario deletado com sucesso!");
      } catch (error: any) {
        new Error(error);
      }
    }

    useEffect(() => {
      getUsers();
    }, []);

    const columns: GridColDef<(typeof rows)[number]>[] = [
      { field: "id", headerName: "ID", align: "left", type: "string", flex: 0 },
      {
        field: "nome",
        headerName: "Nome",
        editable: false,
        flex: 0,
      },
      {
        field: "email",
        headerName: "Email",
        editable: false,
        flex: 0,
      },
      {
        field: "isAdm",
        headerName: "isAdm",
        editable: false,
        flex: 0,
      },
      {
        field: "acoes",
        headerName: "Ações",
        width: 150,
        editable: false,
        align: "center",
        type: "actions",
        flex: 0,
        renderCell: ({ row }) => (
          <div>
            <IconButton onClick={() => delUsers(row.id)}>
              <DeleteIcon />
            </IconButton>
  
            <IconButton onClick={() => putOn(row.id, row.nome, row.email, row.senha)}>
              <EditIcon />
            </IconButton>
          </div>
        ),
      },
    ];
  
    //Mapeando cada item da lista, e o valor de cada item é dado como categoria
    const rows = users.map((usuario) => ({
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email,
      senha: usuario.senha,
    }));

    return (
      <Box>
        <Typography>
            estamos dentro dos usuarios
        </Typography>
        <Typography>
            Ihhhhhhhhh que papinho em
        </Typography>
        <Box>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Novo Usuario
          </Typography>
          <TextField //Prencher Categoria
            id="outlined-helperText"
            label="Nome"
            defaultValue=""
            helperText="Obrigatório"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
          />
          <TextField //Prencher Categoria
            id="outlined-helperText"
            label="Email"
            defaultValue=""
            helperText="Obrigatório"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <TextField //Prencher Categoria
            id="outlined-helperText"
            label="IsAdm"
            defaultValue=""
            helperText="Obrigatório"
            value={isAdm}
            onChange={(e) => setIsAdm(e.target.value)}
          />
          <TextField //Prencher Categoria
            id="outlined-helperText"
            label="senha"
            defaultValue=""
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

      <Box>
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
    )

    
}

export default Usuario 