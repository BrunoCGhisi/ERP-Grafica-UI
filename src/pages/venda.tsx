import React, { useState, useEffect } from "react";
import { CustomerVO } from "../shared/services/types";
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
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { ModalStyle, GridStyle } from "./styles";
//Icones
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import DoneIcon from "@mui/icons-material/Done";

const Venda = () => {
  const [sales, setSales] = useState("");
  const [salesId, setSalesId] = useState("");
  const [idCliente, setIdCliente] = useState("");
  const [idVendedor, setIdVendedor] = useState("");
  const [data, setData] = useState("");
  const [isVendaOS, setIsVendaOS] = useState("");
  const [situacao, setSituacao] = useState("");
  const [desconto, setDesconto] = useState("");

  async function getSales() {
    try {
      const response = await axios.get("http://localhost:3000/venda");
      setSales(response.data.vendas);
    } catch (error: any) {
      new Error(error);
    }
  }

  async function postSales() {
    try {
      const response = await axios.post("http://localhost:3000/venda", {
        idCliente: idCliente,
        idVendedor: idVendedor,
        data: data,
        isVendaOS: isVendaOS,
        situacao: situacao,
        desconto: desconto,
      });
    } catch (error: any) {
      new Error(error);
    } finally {
    }
  }

  //-MODAIS-----------------------------------------------------------------------------------------------------------------------

  const [adopen, setAdOpen] = useState<boolean>(false);
  const addOn = () => setAdOpen(true);
  const addOf = () => setAdOpen(false);

  const [popen, setPOpen] = useState<boolean>(false);
  const putOn = (
    id: string,
    nome: string,
    nomeFantasia: string,
    cpfCnpj: string,
    email: string,
    telefone: string,
    isFornecedor: string,
    dataCadastro: string,
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
    setDataCadastro(dataCadastro);
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

  //------------------------------------------------------------------------------------------------------------------------

  return (
    <Box>
      <MiniDrawer />
      <Box sx={SpaceStyle}>
        <Typography>estamos dentro das vendas</Typography>
        <Typography>(Não somos uma venda)</Typography>
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
                label="DATA"
                defaultValue=""
                helperText="Obrigatório"
                value={dataCadastro}
                onChange={(e) => setDataCadastro(e.target.value)}
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

export default Venda;
