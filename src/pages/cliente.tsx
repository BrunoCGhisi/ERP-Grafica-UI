import React, { useState, useEffect } from "react";

import { CustomerVO } from "../services/types";

import axios from "axios";

import {
  Box,
  InputLabel,
  Select,
  MenuItem,
  Modal,
  Button,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { ModalStyle, GridStyle, SpaceStyle } from "./styles";
import { MiniDrawer } from "../components";
//Icones

import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import DoneIcon from "@mui/icons-material/Done";

const Cliente = () => {
  const [customers, setCustomers] = useState<CustomerVO[]>([]);

  const [customerId, setCustomerId] = useState("");
  // variaveis da coluna
  const [nome, setNome] = useState("");
  const [nomeFantasia, setNomeFantasia] = useState("");
  const [cpfCnpj, setCpfCnpj] = useState("");
  const [telefone, setTelefone] = useState("");
  const [email, setEmail] = useState("");
  const [isFornecedor, setIsFornecedor] = useState("");
  const [cep, setCep] = useState("");
  const [estado, setEstado] = useState("");
  const [cidade, setCidade] = useState("");
  const [numero, setNumero] = useState("");
  const [endereco, setEndereco] = useState("");
  const [complemento, setComplemento] = useState("");
  const [numIe, setNumIe] = useState("");
  const [statusIe, setStatusIe] = useState("");

  // Modal ADD
  const [adopen, setAdOpen] = useState<boolean>(false);
  const addOn = () => setAdOpen(true);
  const addOf = () => setAdOpen(false);

  // Modal PUT
  const [popen, setPOpen] = useState<boolean>(false);
  const putOn = (
    id: string,
    nome: string,
    nomeFantasia: string,
    cpfCnpj: string,
    email: string,
    telefone: string,
    isFornecedor: string,
    numIe: string,
    statusIe: string,
    endereco: string,
    cep: string,
    estado: string,
    numero: string,
    cidade: string,
    complemento: string
  ) => {
    setCustomerId(id);
    setNome(nome);
    setNomeFantasia(nomeFantasia);
    setCpfCnpj(cpfCnpj);
    setEmail(email);
    setTelefone(telefone);
    setIsFornecedor(isFornecedor);
    setNumIe(numIe);
    setStatusIe(statusIe);
    setEndereco(endereco);
    setCep(cep);
    setEstado(estado);
    setNumero(numero);
    setCidade(cidade);
    setComplemento(complemento);

    setPOpen(true);
  };
  const putOf = () => setPOpen(false);

  async function getCustomers() {
    try {
      const response = await axios.get("http://localhost:3000/cliente");
      setCustomers(response.data.clientes); // aqui pe o nome que vem do back antona burra
    } catch (error: any) {
      new Error(error);
    }
  }

  // const mydate = new Date().getDate()

  async function postCustomers() {
    try {
      const response = await axios.post("http://localhost:3000/cliente", {
        nome: nome,
        nomeFantasia: nomeFantasia,
        cpfCnpj: cpfCnpj,
        telefone: telefone,
        email: email,
        isFornecedor: Boolean(isFornecedor),
        cep: cep,
        estado: estado,
        cidade: cidade,
        numero: numero,
        endereco: endereco,
        complemento: complemento,
        numIe: numIe,
        statusIe: Boolean(statusIe),
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

  async function putCustomers() {
    try {
      const response = await axios.put(
        `http://localhost:3000/cliente?id=${customerId}`,
        {
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
          numIe: numIe,
          statusIe: statusIe,
        }
      );
      if (response.status === 200) alert("cliente atualizado com sucesso!");
      getCustomers();
    } catch (error: any) {
      console.error(error);
    } finally {
      putOf();
    }
  }

  async function delCustomers(id: string) {
    try {
      const response = await axios.delete(
        `http://localhost:3000/cliente?id=${id}`
      );
      if (response.status === 200) alert("cliente deletado com sucesso!");
      getCustomers();
    } catch (error: any) {
      console.error(error);
    }
  }

  useEffect(() => {
    getCustomers();
  }, []);

  const columns: GridColDef<CustomerVO>[] = [
    { field: "id", headerName: "ID", editable: false, flex: 0 },
    { field: "nome", headerName: "Nome", editable: false, flex: 0 },
    {
      field: "nomeFantasia",
      headerName: "Nome Fantasia",
      editable: false,
      flex: 0,
    },
    { field: "cpfCnpj", headerName: "CPF/CNPJ", editable: false, flex: 0 },
    { field: "email", headerName: "Email", editable: false, flex: 0 },
    { field: "telefone", headerName: "Telefone", editable: false, flex: 0 },
    {
      field: "isFornecedor",
      headerName: "Fornecedor",
      editable: false,
      flex: 0,
    },
    {
      field: "dataCadastro",
      headerName: "Data Cadastro",
      editable: false,
      flex: 0,
    },
    { field: "numIe", headerName: "Número IE", editable: false, flex: 0 },
    { field: "statusIe", headerName: "Status IE", editable: false, flex: 0 },
    { field: "endereco", headerName: "Endereço", editable: false, flex: 0 },
    { field: "cep", headerName: "CEP", editable: false, flex: 0 },
    { field: "estado", headerName: "Estado", editable: false, flex: 0 },
    { field: "numero", headerName: "Número", editable: false, flex: 0 },
    { field: "cidade", headerName: "Cidade", editable: false, flex: 0 },
    {
      field: "complemento",
      headerName: "Complemento",
      editable: false,
      flex: 0,
    },

    {
      field: "acoes",
      headerName: "Ações",
      width: 150,
      align: "center",
      type: "actions",
      flex: 0,
      renderCell: ({ row }) => (
        <div>
          <IconButton onClick={() => delCustomers(row.id)}>
            <DeleteIcon />
          </IconButton>
          <IconButton
            onClick={() =>
              putOn(
                row.id,
                row.nome,
                row.nomeFantasia,
                row.cpfCnpj,
                row.email,
                row.telefone,
                row.isFornecedor,
                row.numIe,
                row.statusIe,
                row.endereco,
                row.cep,
                row.estado,
                row.numero,
                row.cidade,
                row.complemento
              )
            }
          >
            <EditIcon />
          </IconButton>
        </div>
      ),
    },
  ];

  const rows = customers.map((cliente) => ({
    id: cliente.id.toString(),
    nome: cliente.nome,
    nomeFantasia: cliente.nomeFantasia,
    cpfCnpj: cliente.cpfCnpj,
    email: cliente.email,
    telefone: cliente.telefone,
    isFornecedor: cliente.isFornecedor,
    dataCadastro: cliente.dataCadastro,
    numIe: cliente.numIe,
    statusIe: cliente.statusIe,
    endereco: cliente.endereco,
    cep: cliente.cep,
    estado: cliente.estado,
    numero: cliente.numero,
    cidade: cliente.cidade,
    complemento: cliente.complemento,
  }));

  return (
    <Box>
      <MiniDrawer />
      <Box sx={SpaceStyle}>
        
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
                Novo Cliente
              </Typography>

              <TextField
                id="outlined-helperText"
                label="Nome"
                defaultValue=""
                helperText="Obrigatório"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
              />
              <TextField
                id="outlined-helperText"
                label="nomeFantasia"
                defaultValue=""
                helperText="Obrigatório"
                value={nomeFantasia}
                onChange={(e) => setNomeFantasia(e.target.value)}
              />
              <TextField
                id="outlined-helperText"
                label="cpfCnpj"
                defaultValue=""
                helperText="Obrigatório"
                value={cpfCnpj}
                onChange={(e) => setCpfCnpj(e.target.value)}
              />
              <TextField
                id="outlined-helperText"
                label="telefone"
                defaultValue=""
                helperText="Obrigatório"
                value={telefone}
                onChange={(e) => setTelefone(e.target.value)}
              />

              <TextField
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
                <MenuItem value={"true"}>Normal</MenuItem>
                <MenuItem value={"false"}>Fornecedor </MenuItem>
              </Select>
              <TextField
                id="outlined-helperText"
                label="cep"
                defaultValue=""
                helperText="Obrigatório"
                value={cep}
                onChange={(e) => setCep(e.target.value)}
              />
              <TextField
                id="outlined-helperText"
                label="estado"
                defaultValue=""
                helperText="Obrigatório"
                value={estado}
                onChange={(e) => setEstado(e.target.value)}
              />
              <TextField
                id="outlined-helperText"
                label="cidade"
                defaultValue=""
                helperText="Obrigatório"
                value={cidade}
                onChange={(e) => setCidade(e.target.value)}
              />
              <TextField
                id="outlined-helperText"
                label="numero"
                defaultValue=""
                helperText="Obrigatório"
                value={numero}
                onChange={(e) => setNumero(e.target.value)}
              />
              <TextField
                id="outlined-helperText"
                label="endereco"
                defaultValue=""
                helperText="Obrigatório"
                value={endereco}
                onChange={(e) => setEndereco(e.target.value)}
              />
              <TextField
                id="outlined-helperText"
                label="complemento"
                defaultValue=""
                helperText="Obrigatório"
                value={complemento}
                onChange={(e) => setComplemento(e.target.value)}
              />

              <TextField
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
                onClick={postCustomers}
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
                Editar Banco
              </Typography>
              <TextField
                id="outlined-helperText"
                label="Nome"
                defaultValue=""
                helperText="Obrigatório"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
              />
              <TextField
                id="outlined-helperText"
                label="nomeFantasia"
                defaultValue=""
                helperText="Obrigatório"
                value={nomeFantasia}
                onChange={(e) => setNomeFantasia(e.target.value)}
              />
              <TextField
                id="outlined-helperText"
                label="cpfCnpj"
                defaultValue=""
                helperText="Obrigatório"
                value={cpfCnpj}
                onChange={(e) => setCpfCnpj(e.target.value)}
              />
              <TextField
                id="outlined-helperText"
                label="telefone"
                defaultValue=""
                helperText="Obrigatório"
                value={telefone}
                onChange={(e) => setTelefone(e.target.value)}
              />
              <TextField
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
              <TextField
                id="outlined-helperText"
                label="cep"
                defaultValue=""
                helperText="Obrigatório"
                value={cep}
                onChange={(e) => setCep(e.target.value)}
              />
              <TextField
                id="outlined-helperText"
                label="estado"
                defaultValue=""
                helperText="Obrigatório"
                value={estado}
                onChange={(e) => setEstado(e.target.value)}
              />
              <TextField
                id="outlined-helperText"
                label="cidade"
                defaultValue=""
                helperText="Obrigatório"
                value={cidade}
                onChange={(e) => setCidade(e.target.value)}
              />
              <TextField
                id="outlined-helperText"
                label="numero"
                defaultValue=""
                helperText="Obrigatório"
                value={numero}
                onChange={(e) => setNumero(e.target.value)}
              />
              <TextField
                id="outlined-helperText"
                label="endereco"
                defaultValue=""
                helperText="Obrigatório"
                value={endereco}
                onChange={(e) => setEndereco(e.target.value)}
              />
              <TextField
                id="outlined-helperText"
                label="complemento"
                defaultValue=""
                helperText="Obrigatório"
                value={complemento}
                onChange={(e) => setComplemento(e.target.value)}
              />

              <TextField
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
                onClick={putCustomers}
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

export default Cliente;
