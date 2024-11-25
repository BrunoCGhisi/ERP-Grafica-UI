import {
  InputLabel,
  Select,
  MenuItem,
  Modal,
  Button,
  TextField,
  Grid,
  Box,
  Typography,
} from "@mui/material";
import { ModalStyle } from "../../../shared/styles";
import DoneIcon from "@mui/icons-material/Done";
import { Controller, useForm } from "react-hook-form";
import { ModalRoot } from "../../../shared/components/ModalRoot";
import "../../venda.css";
import {
  clienteSchema,
  clienteSchemaType,
} from "../../../shared/services/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { putClients } from "../../../shared/services/clienteService";
import { PatternFormat } from "react-number-format";

interface ModalEditCompra {
  open: boolean;
  toggleModal: () => void;
  loadClients: () => void;
  idToEdit: number;
  setAlertMessage: (alertMessage: string) => void;
  setShowAlert: (open: boolean) => void;
  clientes: clienteSchemaType[];
}

export function ModalEditCliente({
  clientes,
  open,
  toggleModal,
  loadClients,
  idToEdit,
  setAlertMessage,
  setShowAlert,
}: ModalEditCompra) {
  const filterClientes = clientes.filter((cliente) => cliente.id === idToEdit);
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<clienteSchemaType>({
    resolver: zodResolver(clienteSchema),
    defaultValues: {
      nome: filterClientes[0].nome,
      nomeFantasia: filterClientes[0].nomeFantasia,
      cpfCnpj: filterClientes[0].cpfCnpj,
      telefone: filterClientes[0].telefone,
      email: filterClientes[0].email,
      isFornecedor: filterClientes[0].isFornecedor,
      cep: filterClientes[0].cep,
      estado: filterClientes[0].estado,
      cidade: filterClientes[0].cidade,
      numero: filterClientes[0].numero,
      endereco: filterClientes[0].endereco,
      complemento: filterClientes[0].complemento,
      numIe: filterClientes[0].numIe,
      statusIe: filterClientes[0].statusIe,
    },
  });

  async function handleUpdate(data: clienteSchemaType) {
    try {
      const newData = { ...data, id: idToEdit };
      const response = await putClients(newData);
      if (response.data) {
        setAlertMessage(response.data);
        setShowAlert(true);
        setTimeout(() => {
          setShowAlert(false);
        }, 5000);
      }

      loadClients();
      reset();
      toggleModal();
    } catch (error) {
      console.error("Erro ao atualizar clientes:", error);
    }
  }

  return (
    <Modal
      open={open}
      onClose={toggleModal}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={{ ...ModalStyle, width: "80%", height: "73vh" }}>
        <Grid item xs={12} sx={{ mb: 2 }}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Editar Cliente
          </Typography>
        </Grid>
        <form onSubmit={handleSubmit(handleUpdate)}>
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
                    helperText={errors.nomeFantasia?.message}
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
                    helperText={errors.cpfCnpj?.message || "Obrigatório"}
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
                        <MenuItem value={true}>Não contribuinte</MenuItem>
                        <MenuItem value={false}>Contribuinte</MenuItem>
                      </Select>
                    )}
                  />
                </Grid>
              </Grid>
              <Grid container spacing={2}>
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
                        helperText={errors.cep ? errors.cep.message : ""}
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
                  helperText={errors.endereco?.message}
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
                  helperText={errors.complemento?.message}
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
                  Editar
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </form>
      </Box>
    </Modal>
  );
}
