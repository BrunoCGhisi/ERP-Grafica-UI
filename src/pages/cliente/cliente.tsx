import { useState, useEffect } from "react";
import { PatternFormat } from "react-number-format";
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
  Alert,
  Grid,
} from "@mui/material";
import {
  DataGrid,
  GridColDef,
  GridLocaleText,
  GridRenderCellParams,
  GridRowParams,
} from "@mui/x-data-grid";
import { ModalStyle, GridStyle, SpaceStyle } from "../../shared/styles";
import { MiniDrawer } from "../../shared/components";
//Icones
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import DoneIcon from "@mui/icons-material/Done";
import ArchiveIcon from "@mui/icons-material/Archive";
import { Controller, useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { useOpenModal } from "../../shared/hooks/useOpenModal";
import dayjs from "dayjs";
import {
  clienteSchemaType,
  clienteSchema,
  ClienteDataRow,
} from "../../shared/services/types/clientsVO";
import {
  deleteClients,
  getClients,
  postClients,
} from "../../shared/services/clienteService";
import { ModalEditCliente } from "./components/modal-edit-clientes";
import { ModalGetCliente } from "./components/modal-get-clientes";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";

const Cliente = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },

    control,
    reset,
  } = useForm<clienteSchemaType>({
    resolver: zodResolver(clienteSchema),
  });

  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [customers, setCustomers] = useState<clienteSchemaType[]>([]);
  const { open, toggleModal } = useOpenModal();
  const toggleGetModal = useOpenModal();
  const [selectedRow, setSelectedRow] = useState<ClienteDataRow>();
  const [idToEdit, setIdToEdit] = useState<any>(null);
  const toggleModalDeactivate = useOpenModal();

  // Modal ADD
  const [adopen, setAdOpen] = useState<boolean>(false);
  const addOn = () => {
    setAdOpen(true), reset();
  };
  const addOf = () => setAdOpen(false);

  const handleRowClick = (params: ClienteDataRow) => {
    console.log(params);
    setSelectedRow(params);
    toggleGetModal.toggleModal();
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

  const formatarTelefone = (numero: string): string => {
    if (!numero) return "";

    // Remove caracteres não numéricos
    const somenteNumeros = numero.replace(/\D/g, "");

    // Aplica a máscara de telefone
    if (somenteNumeros.length === 11) {
      // Formato (XX) XXXXX-XXXX
      return `(${somenteNumeros.slice(0, 2)}) ${somenteNumeros.slice(
        2,
        7
      )}-${somenteNumeros.slice(7)}`;
    } else if (somenteNumeros.length === 10) {
      // Formato (XX) XXXX-XXXX
      return `(${somenteNumeros.slice(0, 2)}) ${somenteNumeros.slice(
        2,
        6
      )}-${somenteNumeros.slice(6)}`;
    } else {
      // Retorna o número sem formatação caso o tamanho seja inesperado
      return numero;
    }
  };

  const columns: GridColDef<ClienteDataRow>[] = [
    {
      field: "nome",
      headerName: "Nome",
      editable: false,
      flex: 0,
      headerClassName: "gridHeader--header",
      width: 300,
    },
    {
      field: "telefone",
      headerName: "Telefone",
      editable: false,
      flex: 0,
      headerClassName: "gridHeader--header",
      width: 200,
      renderCell: (params) => <span>{formatarTelefone(params.value)}</span>,
    },
    {
      field: "cidade",
      headerName: "Cidade",
      editable: false,
      flex: 0,
      headerClassName: "gridHeader--header",
      width: 200,
     
    },
    {
      field: "isFornecedor",
      headerName: "Perfil de Cadastro",
      editable: false,
      flex: 0,
      headerClassName: "gridHeader--header",
      width: 200,
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
            onClick={() =>
              row.id !== undefined && [setIdToEdit(row.id), toggleModal()]
            }
          >
            <EditIcon />
          </IconButton>
          <IconButton onClick={() => handleRowClick(row)}>
            <OpenInNewIcon 
            color="primary"
            />
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
    isFornecedor: cliente.isFornecedor == true ? "Fornecedor" : "Cliente",
    dataCadastro: dayjs(cliente.dataCadastro).format("DD/MM/YYYY"),
    numIe: cliente.numIe,
    statusIe: cliente.statusIe == true ? "Ativo" : "Inativo",
    endereco: cliente.endereco,
    cep: cliente.cep,
    estado: cliente.estado,
    numero: cliente.numero,
    cidade: cliente.cidade,
    complemento: cliente.complemento,
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
              <Typography variant="h6">Clientes</Typography>
            </Grid>
            <Grid item>
              <Grid container spacing={2} direction={"row"}>
              
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
            </Grid>
          </Grid>
          <Box>
            <Modal
              open={adopen}
              onClose={addOf}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Box sx={{ ...ModalStyle, width: "80%", height: "73vh" }}>
                <Grid item xs={12} sx={{mb: 2}}>
                  <Typography
                    id="modal-modal-title"
                    variant="h6"
                    component="h2"
                  >
                    Cadastro Cliente
                  </Typography>
                </Grid>
                <form onSubmit={handleSubmit(handleAddClients)}>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Grid container spacing={2}>
                        <Grid item xs={6}>
                          <TextField
                            {...register("nome")}
                            id="outlined-helperText"
                            label="Nome"
                            defaultValue=""
                            helperText={errors.nome?.message || "Obrigatório"}
                            error={!!errors.nome}
                            fullWidth
                          />
                        </Grid>
                        <Grid item xs={6}>
                          <TextField
                            id="outlined-helperText"
                            label="Nome Fantasia"
                            defaultValue=""
                            helperText={
                              errors.nomeFantasia?.message
                            }
                            error={!!errors.nomeFantasia}
                            {...register("nomeFantasia")}
                            fullWidth
                          />
                        </Grid>
                      </Grid>
                      <Grid container spacing={2} sx={{ mt: 0 }}>
                        <Grid item xs={6}>
                          <TextField
                            id="outlined-helperText"
                            label="CPF/CNPJ"
                            defaultValue=""
                            helperText={
                              errors.cpfCnpj?.message || "Obrigatório"
                            }
                            error={!!errors.cpfCnpj}
                            {...register("cpfCnpj")}
                            fullWidth
                          />
                        </Grid>
                        <Grid item xs={6}>
                          <TextField
                            id="outlined-helperText"
                            label="E-Mail"
                            defaultValue=""
                            helperText={errors.email?.message || "Obrigatório"}
                            error={!!errors.email}
                            {...register("email")}
                            fullWidth
                          />
                        </Grid>
                      </Grid>

                      <Grid container spacing={2}>
                        <Grid item xs={6} sx={{ mt: 3 }}>
                          <Controller
                            name="telefone"
                            control={control}
                            render={({ field }) => (
                              <PatternFormat
                                fullWidth
                                {...field}
                                format="(##) #####-####" // Formato de telefone
                                mask="_"
                                customInput={TextField} // Utiliza TextField como input
                                label="Telefone"
                                error={!!errors.telefone}
                                helperText={
                                  errors.telefone
                                    ? errors.telefone.message
                                    : "Obrigatório"
                                }
                              />
                            )}
                          />
                        </Grid>
                        <Grid item xs={6}>
                          <InputLabel id="demo-simple-select-label">
                           Perfil de Cadastro
                          </InputLabel>
                          <Controller
                            control={control}
                            name="isFornecedor"
                            defaultValue={true}
                            render={({ field }) => (
                              <Select
                                fullWidth
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
                            )}
                          />
                        </Grid>
                      </Grid>
                      <Grid container spacing={2}>

                      <Grid item xs={6}>
                          <InputLabel id="demo-simple-select-label">
                            Inscrição Estadual
                          </InputLabel>
                          <Controller
                            control={control}
                            name="statusIe"
                            defaultValue={true}
                            render={({ field }) => (
                              <Select
                                onChange={field.onChange}
                                labelId="select-label"
                                id="demo-simple-select"
                                label="Status da Inscrição Estadual"
                                value={field.value}
                                fullWidth
                              >
                                <MenuItem value={true}>
                                  Não contribuinte
                                </MenuItem>
                                <MenuItem value={false}>Contribuinte</MenuItem>
                              </Select>
                            )}
                          />
                        </Grid>

                        <Grid item xs={6} sx={{ mt: 3 }}>
                          <TextField
                            id="outlined-helperText"
                            label="Numéro da Inscrição Estadual"
                            defaultValue=""
                            helperText={errors.numIe?.message}
                            error={!!errors.numIe}
                            {...register("numIe")}
                            fullWidth
                          />
                        </Grid>
                      </Grid>
                    </Grid>

                    <Grid item xs={6}>
                      <Grid container spacing={1}>
                        <Grid item xs={2.5}>
                          <TextField
                            fullWidth
                            id="outlined-helperText"
                            label="Estado"
                            defaultValue=""
                            helperText={errors.estado?.message}
                            error={!!errors.estado}
                            {...register("estado")}
                          />
                        </Grid>
                        <Grid item xs={4}>
                          <TextField
                            id="outlined-helperText"
                            label="Cidade"
                            defaultValue=""
                            helperText={errors.cidade?.message}
                            error={!!errors.cidade}
                            {...register("cidade")}
                          />
                        </Grid>
                        <Grid item xs={2.5}>
                          <TextField
                            id="outlined-helperText"
                            label="Número"
                            defaultValue=""
                            helperText={errors.numero?.message}
                            error={!!errors.numero}
                            {...register("numero")}
                          />
                        </Grid>
                        <Grid item xs={3}>
                          <Controller
                            name="cep"
                            control={control}
                            render={({ field }) => (
                              <PatternFormat
                                {...field}
                                format="#####-###" // Formato de telefone
                                mask="_"
                                customInput={TextField} // Utiliza TextField como input
                                label="CEP"
                                error={!!errors.cep}
                                helperText={
                                  errors.cep
                                    ? errors.cep.message
                                    : ""
                                }
                                fullWidth
                              />
                            )}
                          />
                        </Grid>
                      </Grid>

                      <Grid item xs={12} sx={{ mt: 5 }}>
                        <TextField
                          fullWidth
                          id="outlined-helperText"
                          label="Endereço"
                          defaultValue=""
                          helperText={errors.endereco?.message }
                          error={!!errors.endereco}
                          {...register("endereco")}
                        />
                      </Grid>

                      <Grid item xs={12} sx={{ mt: 5.5 }}>
                        <TextField
                          fullWidth
                          id="outlined-helperText"
                          label="Complemento"
                          defaultValue=""
                          helperText={
                            errors.complemento?.message 
                          }
                          error={!!errors.complemento}
                          {...register("complemento")}
                        />
                      </Grid>
                      <Grid item xs={12} sx={{ textAlign: "right", mt: 11 }}>
                        <Button
                          type="submit"
                          variant="outlined"
                          startIcon={<DoneIcon />}
                        >
                          Cadastrar
                        </Button>
                      </Grid>
                    </Grid>
                  </Grid>
                </form>
              </Box>
            </Modal>
            {/* -------------------------------------------------------------------------- */}
            {open && (
              <ModalEditCliente
                open={open}
                toggleModal={toggleModal}
                idToEdit={idToEdit}
                clientes={customers}
                setAlertMessage={setAlertMessage}
                setShowAlert={setShowAlert}
                loadClients={loadClients}
              />
            )}
            {toggleGetModal.open && (
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
      {showAlert && <Alert severity="info">{alertMessage}</Alert>}
    </Box>
  );
};

export default Cliente;
