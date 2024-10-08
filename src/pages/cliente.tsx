import { useState, useEffect } from "react";
import axios from "axios";
import {Box,
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
import { ModalStyle, GridStyle, SpaceStyle } from "../shared/styles";
import { MiniDrawer } from "../shared/components";
//Icones
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import DoneIcon from "@mui/icons-material/Done";

import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ModalRoot } from "../shared/components/ModalRoot";
import { useOpenModal } from "../shared/hooks/useOpenModal";

const clienteSchema = z.object({
  id: z.number().optional(),
  nome: z.string(),
  nomeFantasia: z.string(),
  cpfCnpj: z.string(),
  telefone: z.string(),
  email: z.string().email(),
  isFornecedor: z.boolean(),
  cep: z.string(),
  estado: z.string(),
  cidade: z.string(),
  numero: z.string(),
  endereco: z.string(),
  complemento: z.string(),
  dataCadastro: z.string(),
  numIe: z.string(),
  statusIe: z.boolean(),
});

type clienteSchemaType = z.infer<typeof clienteSchema>;

const Cliente = () => {
  const [customers, setCustomers] = useState<clienteSchemaType[]>([]);
  const {open, toggleModal} = useOpenModal();
  // Modal ADD
  const [adopen, setAdOpen] = useState<boolean>(false);
  const addOn = () => setAdOpen(true);
  const addOf = () => setAdOpen(false);

  // Modal PUT
  const [popen, setPOpen] = useState<boolean>(false);
  const putOn = (id: number) => {
    const clienteFilter = customers.filter(
      (cliente: clienteSchemaType) => cliente.id === id
    );
    if (clienteFilter.length > 0) {
      setValue("id", clienteFilter[0].id);
      setValue("nome", clienteFilter[0].nome);
      setValue("nomeFantasia", clienteFilter[0].nomeFantasia);
      setValue("cpfCnpj", clienteFilter[0].cpfCnpj);
      setValue("telefone", clienteFilter[0].telefone);
      setValue("email", clienteFilter[0].email);
      setValue("isFornecedor", clienteFilter[0].isFornecedor);
      setValue("cep", clienteFilter[0].cep);
      setValue("estado", clienteFilter[0].estado);
      setValue("cidade", clienteFilter[0].cidade);
      setValue("endereco", clienteFilter[0].endereco);
      setValue("complemento", clienteFilter[0].complemento);
      setValue("dataCadastro", clienteFilter[0].dataCadastro);
      setValue("numIe", clienteFilter[0].numIe);
      setValue("statusIe", clienteFilter[0].statusIe);
    }
    setPOpen(true);
  };
  const putOf = () => setPOpen(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    control,
  } = useForm<clienteSchemaType>({
    resolver: zodResolver(clienteSchema),
  });

  async function getCustomers() {
    try {
      const response = await axios.get("http://localhost:3000/cliente");
      setCustomers(response.data.clientes); // aqui pe o nome que vem do back antona burra
    } catch (error: any) {
      new Error(error);
    }
  }

  async function postCustomers(data: clienteSchemaType) {
    try {
      const response = await axios.post("http://localhost:3000/cliente", data);
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

  async function putCustomers(data: clienteSchemaType) {
    try {
      const response = await axios.put(
        `http://localhost:3000/cliente?id=${data.id}`,
        data
      );
      if (response.status === 200) alert("cliente atualizado com sucesso!");
      getCustomers();
    } catch (error: any) {
      console.error(error);
    } finally {
      putOf();
    }
  }

  async function delCustomers(id: number) {
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

  const columns: GridColDef<clienteSchemaType>[] = [
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
          <IconButton
            onClick={() => row.id !== undefined && delCustomers(row.id)}
          >
            <DeleteIcon />
          </IconButton>
          <IconButton onClick={() => row.id !== undefined && putOn(row.id)}>
            <EditIcon />
          </IconButton>
        </div>
      ),
    },
  ];

  const rows = customers.map((cliente) => ({
    id: cliente.id,
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
              <form onSubmit={handleSubmit(postCustomers)}>
                <TextField
                  id="outlined-helperText"
                  label="Nome"
                  defaultValue=""
                  helperText={errors.nome?.message || "Obrigatório"}
                  error={!!errors.nome}
                  {...register("nome")}
                />
                <TextField
                  id="outlined-helperText"
                  label="nomeFantasia"
                  defaultValue=""
                  helperText={errors.nomeFantasia?.message || "Obrigatório"}
                  error={!!errors.nomeFantasia}
                  {...register("nomeFantasia")}
                />
                <TextField
                  id="outlined-helperText"
                  label="cpfCnpj"
                  defaultValue=""
                  helperText={errors.cpfCnpj?.message || "Obrigatório"}
                  error={!!errors.cpfCnpj}
                  {...register("cpfCnpj")}
                />
                <TextField
                  id="outlined-helperText"
                  label="telefone"
                  defaultValue=""
                  helperText={errors.telefone?.message || "Obrigatório"}
                  error={!!errors.telefone}
                  {...register("telefone")}
                />

                <TextField
                  id="outlined-helperText"
                  label="email"
                  defaultValue=""
                  helperText={errors.email?.message || "Obrigatório"}
                  error={!!errors.email}
                  {...register("email")}
                />
                <InputLabel id="demo-simple-select-label">StatusIe</InputLabel>
                <Select
                  labelId="select-label"
                  id="demo-simple-select"
                  label="IsFornecedor"
                  error={!!errors.isFornecedor}
                  {...register("isFornecedor")}
                >
                  <MenuItem value={"true"}>Cliente</MenuItem>
                  <MenuItem value={"false"}>Fornecedor </MenuItem>
                </Select>

                <TextField
                  id="outlined-helperText"
                  label="cep"
                  defaultValue=""
                  helperText={errors.cep?.message || "Obrigatório"}
                  error={!!errors.cep}
                  {...register("cep")}
                />
                <TextField
                  id="outlined-helperText"
                  label="estado"
                  defaultValue=""
                  helperText={errors.estado?.message || "Obrigatório"}
                  error={!!errors.estado}
                  {...register("estado")}
                />
                <TextField
                  id="outlined-helperText"
                  label="cidade"
                  defaultValue=""
                  helperText={errors.cidade?.message || "Obrigatório"}
                  error={!!errors.cidade}
                  {...register("cidade")}
                />
                <TextField
                  id="outlined-helperText"
                  label="numero"
                  defaultValue=""
                  helperText={errors.numero?.message || "Obrigatório"}
                  error={!!errors.numero}
                  {...register("numero")}
                />
                <TextField
                  id="outlined-helperText"
                  label="endereco"
                  defaultValue=""
                  helperText={errors.endereco?.message || "Obrigatório"}
                  error={!!errors.endereco}
                  {...register("endereco")}
                />
                <TextField
                  id="outlined-helperText"
                  label="complemento"
                  defaultValue=""
                  helperText={errors.complemento?.message || "Obrigatório"}
                  error={!!errors.complemento}
                  {...register("complemento")}
                />

                <TextField
                  id="outlined-helperText"
                  label="numIe"
                  defaultValue=""
                  helperText={errors.numIe?.message || "Obrigatório"}
                  error={!!errors.numIe}
                  {...register("numIe")}
                />
                <InputLabel id="demo-simple-select-label">StatusIe</InputLabel>
                <Select
                  labelId="select-label"
                  id="demo-simple-select"
                  error={!!errors.statusIe}
                  {...register("statusIe")}
                  defaultValue={"true"}
                >
                  <MenuItem value={"false"}>Off</MenuItem>
                  <MenuItem value={"true"}>On </MenuItem>
                </Select>

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
{/* -------------------------------------------------------------------------- */}
          <Modal
            open={open}
            onClose={toggleModal}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <ModalRoot children={
            <form onSubmit={handleSubmit(putCustomers)}>
              <TextField
                id="outlined-helperText"
                label="Nome"
                defaultValue=""
                helperText={errors.nome?.message || "Obrigatório"}
                error={!!errors.nome}
                {...register("nome")}
              />
              <TextField
                id="outlined-helperText"
                label="nomeFantasia"
                defaultValue=""
                helperText={errors.nomeFantasia?.message || "Obrigatório"}
                error={!!errors.nomeFantasia}
                {...register("nomeFantasia")}
              />
              <TextField
                id="outlined-helperText"
                label="cpfCnpj"
                defaultValue=""
                helperText={errors.cpfCnpj?.message || "Obrigatório"}
                error={!!errors.cpfCnpj}
                {...register("cpfCnpj")}
              />
              <TextField
                id="outlined-helperText"
                label="telefone"
                defaultValue=""
                helperText={errors.telefone?.message || "Obrigatório"}
                error={!!errors.telefone}
                {...register("telefone")}
              />

              <TextField
                id="outlined-helperText"
                label="email"
                defaultValue=""
                helperText={errors.email?.message || "Obrigatório"}
                error={!!errors.email}
                {...register("email")}
              />
              
              <InputLabel id="demo-simple-select-label">StatusIe</InputLabel>
              <Controller
                control={control}
                name="isFornecedor"
                defaultValue={true}
                render={({field}) => (
                <Select
                  onChange={field.onChange}
                  labelId="select-label"
                  id="demo-simple-select"
                  label="IsFornecedor"
                  error={!!errors.isFornecedor}
                  value={field.value}
                >
                  <MenuItem value={false}>Cliente</MenuItem>
                  <MenuItem value={true}>Fornecedor </MenuItem>
                </Select>
                )}/>

              <TextField
                id="outlined-helperText"
                label="cep"
                defaultValue=""
                helperText={errors.cep?.message || "Obrigatório"}
                error={!!errors.cep}
                {...register("cep")}
              />
              <TextField
                id="outlined-helperText"
                label="estado"
                defaultValue=""
                helperText={errors.estado?.message || "Obrigatório"}
                error={!!errors.estado}
                {...register("estado")}
              />
              <TextField
                id="outlined-helperText"
                label="cidade"
                defaultValue=""
                helperText={errors.cidade?.message || "Obrigatório"}
                error={!!errors.cidade}
                {...register("cidade")}
              />
              <TextField
                id="outlined-helperText"
                label="numero"
                defaultValue=""
                helperText={errors.numero?.message || "Obrigatório"}
                error={!!errors.numero}
                {...register("numero")}
              />
              <TextField
                id="outlined-helperText"
                label="endereco"
                defaultValue=""
                helperText={errors.endereco?.message || "Obrigatório"}
                error={!!errors.endereco}
                {...register("endereco")}
              />
              <TextField
                id="outlined-helperText"
                label="complemento"
                defaultValue=""
                helperText={errors.complemento?.message || "Obrigatório"}
                error={!!errors.complemento}
                {...register("complemento")}
              />

              <TextField
                id="outlined-helperText"
                label="numIe"
                defaultValue=""
                helperText={errors.numIe?.message || "Obrigatório"}
                error={!!errors.numIe}
                {...register("numIe")}
              />
              <InputLabel id="demo-simple-select-label">StatusIe</InputLabel>
              <Controller
                control={control}
                name="statusIe"
                defaultValue={true}
                render={({field}) => (
                <Select
                  onChange={field.onChange}
                  labelId="select-label"
                  id="demo-simple-select"
                  label="statusIe"
                  value={field.value} 
                >
                  <MenuItem value={true}>Off</MenuItem>
                  <MenuItem value={false}>On </MenuItem>
                </Select>
              )}/>
              <Button
                type="submit"
                variant="outlined"
                startIcon={<DoneIcon />}
              >
                Alterar
              </Button>
            </form>}/>

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
