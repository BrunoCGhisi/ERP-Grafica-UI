import { useState, useEffect } from "react";
import { PatternFormat } from 'react-number-format';
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
  Typography, Alert
} from "@mui/material";
import { DataGrid, GridColDef, GridRenderCellParams, GridRowParams } from "@mui/x-data-grid";
import { ModalStyle, GridStyle, SpaceStyle } from "../../shared/styles";
import { MiniDrawer } from "../../shared/components";
//Icones
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import DoneIcon from "@mui/icons-material/Done";

import { Controller, useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { useOpenModal } from "../../shared/hooks/useOpenModal";
import dayjs from "dayjs";
import { clienteSchemaType, clienteSchema, ClienteDataRow } from "../../shared/services/types/clientsVO";
import { deleteClients, getClients, postClients } from "../../shared/services/clienteService";
import { ModalEditCliente } from "./components/modal-edit-clientes";
import { ModalGetCliente } from "./components/modal-get-clientes";
import OpenInNewIcon from '@mui/icons-material/OpenInNew';

const Cliente = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },

    control,
    reset
  } = useForm<clienteSchemaType>({
    resolver: zodResolver(clienteSchema),
  });

  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [customers, setCustomers] = useState<clienteSchemaType[]>([]);
  const {open, toggleModal} = useOpenModal();
  const toggleGetModal = useOpenModal();
  const [selectedRow, setSelectedRow] = useState<ClienteDataRow>();
  const [idToEdit, setIdToEdit] = useState<any>(null)

  // Modal ADD
  const [adopen, setAdOpen] = useState<boolean>(false);
  const addOn = () => {setAdOpen(true), reset()};
  const addOf = () => setAdOpen(false);

  const handleRowClick = (params: ClienteDataRow) => {
    console.log(params)
    setSelectedRow(params)
    toggleGetModal.toggleModal()
   };

// CRUDs--------------------------------------------------  

const loadClients = async () => {
  const response = await getClients();
  setCustomers(response);
};

const handleAddClients = async (data: clienteSchemaType) => {
  const response = await postClients(data);
  if (response) {
    setAlertMessage(response.data);
    setShowAlert(true);
    setTimeout(() => {
      setShowAlert(false);
    }, 5000);
  }

  loadClients();
  reset();
  setAdOpen(false);
};

const handleDelete = async (id: number) => {
  await deleteClients(id);
  loadClients();
};

useEffect(() => {
  loadClients();
}, []);

  const columns: GridColDef<ClienteDataRow>[] = [
   
    { field: "nome", headerName: "Nome", editable: false, flex: 0, headerClassName: "gridHeader--header", },
    {
      field: "nomeFantasia",
      headerName: "Nome Fantasia",
      editable: false,
      flex: 0,
      headerClassName: "gridHeader--header",
    },
    { field: "cpfCnpj", headerName: "CPF/CNPJ", editable: false, flex: 0 , headerClassName: "gridHeader--header",},
    { field: "email", headerName: "Email", editable: false, flex: 0, headerClassName: "gridHeader--header",},
    { field: "telefone", headerName: "Telefone", editable: false, flex: 0, headerClassName: "gridHeader--header", },
    {
      field: "isFornecedor",
      headerName: "Perfil de Cadastro",
      editable: false,
      flex: 0,
      headerClassName: "gridHeader--header",
    },
    {
      field: "dataCadastro",
      headerName: "Data Cadastro",
      editable: false,
      flex: 0,
      headerClassName: "gridHeader--header",
    },
    { field: "numIe", headerName: "Numéro da Inscrição Estadual", editable: false, flex: 0, headerClassName: "gridHeader--header", },
    { field: "statusIe", headerName: "Status IE", editable: false, flex: 0, headerClassName: "gridHeader--header", },
    { field: "endereco", headerName: "Endereço", editable: false, flex: 0, headerClassName: "gridHeader--header", },
    { field: "cep", headerName: "CEP", editable: false, flex: 0, headerClassName: "gridHeader--header", },
    { field: "estado", headerName: "Estado", editable: false, flex: 0, headerClassName: "gridHeader--header", },
    { field: "numero", headerName: "Número", editable: false, flex: 0, headerClassName: "gridHeader--header", },
    { field: "cidade", headerName: "Cidade", editable: false, flex: 0, headerClassName: "gridHeader--header", },
    {
      field: "complemento",
      headerName: "Complemento",
      editable: false,
      flex: 0,
      headerClassName: "gridHeader--header",
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
          <IconButton
            onClick={() => row.id !== undefined && handleDelete(row.id)}
          >
            <DeleteIcon />
          </IconButton>
          <IconButton onClick={() => row.id !== undefined && [setIdToEdit(row.id), toggleModal()]}>
            <EditIcon />
          </IconButton>
          <IconButton onClick={() => handleRowClick(row)}>
            <OpenInNewIcon />
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
    isFornecedor: cliente.isFornecedor == true ?  "Fornecedor" : "Cliente",
    dataCadastro: dayjs(cliente.dataCadastro).format("DD/MM/YYYY"),
    numIe: cliente.numIe,
    statusIe: cliente.statusIe == true ?  "Ativo" : "Inativo",
    endereco: cliente.endereco,
    cep: cliente.cep,
    estado: cliente.estado,
    numero: cliente.numero,
    cidade: cliente.cidade,
    complemento: cliente.complemento,
  }));

  return (
    <Box>
      <MiniDrawer> 
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
              <form onSubmit={handleSubmit(handleAddClients)}>

                <TextField
                  {...register("nome")}
                  id="outlined-helperText"
                  label="Nome"
                  defaultValue=""
                  helperText={errors.nome?.message || "Obrigatório"}
                  error={!!errors.nome}
                  
                />

                <TextField
                  id="outlined-helperText"
                  label="Nome Fantasia"
                  defaultValue=""
                  helperText={errors.nomeFantasia?.message || "Obrigatório"}
                  error={!!errors.nomeFantasia}
                  {...register("nomeFantasia")}
                />

                <TextField
                  id="outlined-helperText"
                  label="CPF/CNPJ"
                  defaultValue=""
                  helperText={errors.cpfCnpj?.message || "Obrigatório"}
                  error={!!errors.cpfCnpj}
                  {...register("cpfCnpj")}
                />
                  
                  <Controller
                    name="telefone"
                    control={control}
                    render={({ field }) => (
                      <PatternFormat
                        {...field}
                        format="(##) #####-####" // Formato de telefone
                        mask="_"
                        customInput={TextField} // Utiliza TextField como input
                        label="Telefone"
                        error={!!errors.telefone}
                        helperText={errors.telefone ? errors.telefone.message : "Obrigatório"}
                        fullWidth
                      />
                    )}
                  />
                

                <TextField
                  id="outlined-helperText"
                  label="E-Mail"
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
                  label="Perfil de Cadastro"
                  error={!!errors.isFornecedor}
                  value={field.value}
                >
                  <MenuItem value={false}>Cliente</MenuItem>
                  <MenuItem value={true}>Fornecedor </MenuItem>
                </Select>
                )}/>

                <Controller
                    name="cep"
                    control={control}
                    render={({ field }) => (
                      <PatternFormat
                        {...field}
                        format="####-####" // Formato de telefone
                        mask="_"
                        customInput={TextField} // Utiliza TextField como input
                        label="CEP"
                        error={!!errors.cep}
                        helperText={errors.cep ? errors.cep.message : "Obrigatório"}
                        fullWidth
                      />
                    )}
                  />
                
                <TextField
                  id="outlined-helperText"
                  label="Estado"
                  defaultValue=""
                  helperText={errors.estado?.message || "Obrigatório"}
                  error={!!errors.estado}
                  {...register("estado")}
                />
                <TextField
                  id="outlined-helperText"
                  label="Cidade"
                  defaultValue=""
                  helperText={errors.cidade?.message || "Obrigatório"}
                  error={!!errors.cidade}
                  {...register("cidade")}
                />
                <TextField
                  id="outlined-helperText"
                  label="Número"
                  defaultValue=""
                  helperText={errors.numero?.message || "Obrigatório"}
                  error={!!errors.numero}
                  {...register("numero")}
                />
                <TextField
                  id="outlined-helperText"
                  label="Endereço"
                  defaultValue=""
                  helperText={errors.endereco?.message || "Obrigatório"}
                  error={!!errors.endereco}
                  {...register("endereco")}
                />
                <TextField
                  id="outlined-helperText"
                  label="Complemento"
                  defaultValue=""
                  helperText={errors.complemento?.message || "Obrigatório"}
                  error={!!errors.complemento}
                  {...register("complemento")}
                />

                <TextField
                  id="outlined-helperText"
                  label="Numéro da Inscrição Estadual"
                  defaultValue=""
                  helperText={errors.numIe?.message || "Obrigatório"}
                  error={!!errors.numIe}
                  {...register("numIe")}
                />
                <InputLabel id="demo-simple-select-label">Inscrição Estadual</InputLabel>

                <Controller
                control={control}
                name="statusIe"
                defaultValue={true}
                render={({field}) => (
                <Select
                  onChange={field.onChange}
                  labelId="select-label"
                  id="demo-simple-select"
                  label="Status da Inscrição Estadual"
                  value={field.value} 
                >
                  <MenuItem value={true}>Não contribuinte</MenuItem>
                  <MenuItem value={false}>Contribuinte</MenuItem>
                </Select>
              )}/>

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
          { open && (
            <ModalEditCliente
            open={open}
            toggleModal={toggleModal}
            idToEdit={idToEdit}
            clientes={customers}
            setAlertMessage={setAlertMessage}
            setShowAlert={setShowAlert}
            loadClients = {loadClients}
            />
          )}
          { toggleGetModal.open && (
              <ModalGetCliente
                clientes={customers}
                rowData={selectedRow}
                open={toggleGetModal.open}
                toggleModal={toggleGetModal.toggleModal}
              />

            )}
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
      </MiniDrawer>
      {showAlert && <Alert severity="info">{alertMessage}</Alert>}
    </Box>
  );
};

export default Cliente;
