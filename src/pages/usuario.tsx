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
    
    async function getUsers() {
      try { 
        const response = await axios.get("http://localhost:3000/Usuario"); //VERIFICAR SE O NOME TA CERTO
        setUsers(response.data.usuarios); // aqui pe o nome que vem do back antona burra
      } catch (error: any) {
        new Error(error);
      }
    }

    async function postUsers() {
      try {
        const response = await axios.post("http://localhost:3000/Cliente", {
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
    useEffect(() => {
      getUsers();
    }, []);

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
              Novo Cliente
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
        </Box>
    )

    
}

export default Usuario 