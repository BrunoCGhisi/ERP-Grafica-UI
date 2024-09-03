import React, { useState, useEffect } from "react";

import { CustomerVO } from "../services/types";

import axios from "axios";

import {
    Accordion,
    AccordionDetails,
    Box,
    InputLabel,
    Select,
    MenuItem,
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

const Cliente = () => {

    const [customers, setCustomers] = useState<CustomerVO[]>([]);
    const [customerId, setCustomerId] = useState("");
    // variaveis da coluna
    const [nome, setNome] = useState("")
    const [nomeFantasia, setNomeFantasia] = useState("")
    const [cpfCnpj, setCpfCnpj] = useState("")
    const [telefone, setTelefone] = useState("")
    const [email, setEmail] = useState("")
    const [isFornecedor, setIsFornecedor] = useState("")
    const [cep, setCep] = useState("")
    const [estado, setEstado] = useState("")
    const [cidade, setCidade] = useState("")
    const [numero, setNumero] = useState("")
    const [endereco, setEndereco] = useState("")
    const [complemento, setComplemento] = useState("")
    const [dataCadastro, setDataCadastro] = useState("")
    const [numIe, setNumIe] = useState("")
    const [statusIe, setStatusIe] = useState("")
    
    async function getCustomers() {
        try { 
          const response = await axios.get("http://localhost:3000/cliente"); 
          setCustomers(response.data.clientes); // aqui pe o nome que vem do back antona burra
        } catch (error: any) {
          new Error(error);
        }
      }

      async function postCustomer() {
        try {
          const response = await axios.post("http://localhost:3000/cliente", {
            nome: nome,
            nomeFantasia: nomeFantasia,
            cpfCnpj: cpfCnpj,
            telefone: telefone,
            email: email,
            isFornecedor: isFornecedor,
            cep: cep,
            estado: estado,
            cidade: cidade,
            numero: numero,
            endereco: endereco,
            complemento: complemento,
            dataCadastro: dataCadastro,
            numIe: numIe,
            statusIe: statusIe,
          });
          getCustomers();
          if (response.status === 200) alert("Cliente cadastro com sucesso!");
        } catch (error: any) {
          new Error(error);
        } finally {
          
        }
      }

      useEffect(() => {
        getCustomers();
      }, []);

    return (
        <Box>
            <Typography>
                estamos dentro dos clientes
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
                label="nomeFantasia"
                defaultValue=""
                helperText="Obrigatório"
                value={nomeFantasia}
                onChange={(e) => setNomeFantasia(e.target.value)}
              />
              <TextField //Prencher Categoria
                id="outlined-helperText"
                label="cpfCnpj"
                defaultValue=""
                helperText="Obrigatório"
                value={cpfCnpj}
                onChange={(e) => setCpfCnpj(e.target.value)}
              />
              <TextField //Prencher Categoria
                id="outlined-helperText"
                label="telefone"
                defaultValue=""
                helperText="Obrigatório"
                value={telefone}
                onChange={(e) => setTelefone(e.target.value)}
              />
              <TextField //Prencher Categoria
                id="outlined-helperText"
                label="email"
                defaultValue=""
                helperText="Obrigatório"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <InputLabel id="demo-simple-select-label">StatusIe</InputLabel>
              <Select
                labelId="select-label"
                id="demo-simple-select"
                value={isFornecedor}
                label="IsFornecedor"
                onChange={(e) => setIsFornecedor(e.target.value)}
              >
                <MenuItem value={"0"}>Normal</MenuItem>
                <MenuItem value={"1"}>Fornecedor </MenuItem>
              </Select>
              <TextField //Prencher Categoria
                id="outlined-helperText"
                label="cep"
                defaultValue=""
                helperText="Obrigatório"
                value={cep}
                onChange={(e) => setCep(e.target.value)}
              />
              <TextField //Prencher Categoria
                id="outlined-helperText"
                label="estado"
                defaultValue=""
                helperText="Obrigatório"
                value={estado}
                onChange={(e) => setEstado(e.target.value)}
              />
              <TextField //Prencher Categoria
                id="outlined-helperText"
                label="cidade"
                defaultValue=""
                helperText="Obrigatório"
                value={cidade}
                onChange={(e) => setCidade(e.target.value)}
              />
              <TextField //Prencher Categoria
                id="outlined-helperText"
                label="numero"
                defaultValue=""
                helperText="Obrigatório"
                value={numero}
                onChange={(e) => setNumero(e.target.value)}
              />
              <TextField //Prencher Categoria
                id="outlined-helperText"
                label="endereco"
                defaultValue=""
                helperText="Obrigatório"
                value={endereco}
                onChange={(e) => setEndereco(e.target.value)}
              />
              <TextField //Prencher Categoria
                id="outlined-helperText"
                label="complemento"
                defaultValue=""
                helperText="Obrigatório"
                value={complemento}
                onChange={(e) => setComplemento(e.target.value)}
              />
              <TextField //Prencher Categoria
                id="outlined-helperText"
                label="dataCadastro"
                defaultValue=""
                helperText="Obrigatório"
                value={dataCadastro}
                onChange={(e) => setDataCadastro(e.target.value)}
              />
              <TextField //Prencher Categoria
                id="outlined-helperText"
                label="numIe"
                defaultValue=""
                helperText="Obrigatório"
                value={numIe}
                onChange={(e) => setNumIe(e.target.value)}
              />
              <InputLabel id="demo-simple-select-label">StatusIe</InputLabel>
              <Select
                labelId="select-label"
                id="demo-simple-select"
                value={statusIe}
                label="StatusIe"
                onChange={(e) => setStatusIe(e.target.value)}
              >
                <MenuItem value={"0"}>Off</MenuItem>
                <MenuItem value={"1"}>On </MenuItem>
              </Select>
              
              <Button
                onClick={postCustomer}
                variant="outlined"
                startIcon={<DoneIcon />}
              >
                Cadastrar
              </Button>
        
          </Box>

        </Box>

        
    )
}


export default Cliente