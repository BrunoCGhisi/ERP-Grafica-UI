import { useState, useEffect, InputHTMLAttributes, HTMLAttributes  } from "react";
import { NumericFormat, PatternFormat } from 'react-number-format';
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
  InputAdornment,
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
import dayjs from "dayjs";

const clienteSchema = z.object({
  id: z.number().optional(),
  nome: z.string().refine((doc) => doc.trim() !== "",{
    message: "Campo obrigatório"
  }),
  nomeFantasia: z.string().optional(),
  cpfCnpj: z.string().
  refine((doc) => /^[0-9]+$/.test(doc), {
    message:'CPF/CNPJ deve conter apenas números.'
  })
  .refine((doc) => {
    return doc.length >= 11;
  }, 'CPF/CNPJ deve conter no mínimo 11 caracteres.')
  .refine((doc) => {
    return doc.length <= 14;
  }, 'CPF/CNPJ deve conter no máximo 14 caracteres.'),


  telefone: z.string().transform((val) => val.replace(/[^0-9]/g, "")).refine((doc) => {
    return doc.length >= 11;}, 'CPF/CNPJ deve conter no mínimo 11 caracteres.'),
  email: z.string().email(),
  isFornecedor: z.boolean(),
  cep: z.string().optional(),
  estado: z.string().optional(),
  cidade: z.string().optional(),
  numero: z.string().optional(),
  endereco: z.string().optional(),
  complemento: z.string().optional(),
  numIe: z.string().optional(),
  statusIe: z.boolean(),
});


interface dataRow {
  id: number,
  nome: string,
  nomeFantasia: string,
  cpfCnpj: string,
  telefone: string,
  email: string,
  isFornecedor: boolean,
  cep: string,
  estado: string,
  cidade: string,
  numero: string,
  endereco: string,
  complemento: string,
  numIe: string,
  statusIe: boolean,
}

type clienteSchemaType = z.infer<typeof clienteSchema>;

const Cliente = () => {

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    control,
    reset
  } = useForm<clienteSchemaType>({
    resolver: zodResolver(clienteSchema),
  });

  const [customers, setCustomers] = useState<clienteSchemaType[]>([]);
  const {open, toggleModal} = useOpenModal();
  const [selectedData, setSelectedData] = useState<dataRow | null>(null);
  // Modal ADD
  const [adopen, setAdOpen] = useState<boolean>(false);
  const addOn = () => {setAdOpen(true), reset()};
  const addOf = () => setAdOpen(false);


  const handleEdit = (updateData: dataRow) => {
    setSelectedData(updateData);
    toggleModal()
  }

  useEffect(() => {
    if (selectedData) {
      setValue("id", selectedData.id);
      setValue("nome", selectedData.nome);
      setValue("nomeFantasia", selectedData.nomeFantasia);
      setValue("cpfCnpj", selectedData.cpfCnpj);
      setValue("telefone", selectedData.telefone);
      setValue("email", selectedData.email);
      setValue("isFornecedor", selectedData.isFornecedor);
      setValue("cep", selectedData.cep);
      setValue("estado", selectedData.estado);
      setValue("cidade", selectedData.cidade);
      setValue("numero", selectedData.numero);
      setValue("endereco", selectedData.endereco);
      setValue("complemento", selectedData.complemento);
      setValue("numIe", selectedData.numIe);
      setValue("statusIe", selectedData.statusIe);
    }
  }, [selectedData, setValue]);

  useEffect(() => {
    getCustomers();
  }, [open]);
// CRUDs--------------------------------------------------  

  async function getCustomers() {
    try {
      const response = await axios.get("http://localhost:3000/cliente");
      setCustomers(response.data.clientes); 
    } catch (error: any) {
      new Error(error);
    }
  }

  async function postCustomers(data: clienteSchemaType) {
    
    
    try {
      const response = await axios.post("http://localhost:3000/cliente", {
        nome: data.nome,
        nomeFantasia: data.nome,
        cpfCnpj: data.cpfCnpj,
        telefone: data.telefone,
        email: data.email,
        isFornecedor: data.isFornecedor,
        cep: data.cep,
        estado: data.estado,
        cidade: data.cidade,
        numero: data.numero,
        endereco: data.endereco,
        complemento: data.complemento,
        numIe: data.numIe,
        statusIe: data.statusIe
      });
      getCustomers();
      if (response.status === 200) alert("Cliente cadastro com sucesso!");
    } catch (error: any) {
      new Error(error);
    } finally {
      addOf()
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
      toggleModal();
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

  const columns: GridColDef<dataRow>[] = [
   
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
      headerName: "Fornecedor",
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
    { field: "numIe", headerName: "Número IE", editable: false, flex: 0, headerClassName: "gridHeader--header", },
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
            onClick={() => row.id !== undefined && delCustomers(row.id)}
          >
            <DeleteIcon />
          </IconButton>
          <IconButton onClick={() => row.id !== undefined && handleEdit(row)}>
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
    isFornecedor: cliente.isFornecedor == true ?  "Fornecedor" : "Cliente",
    dataCadastro: dayjs( cliente.dataCadastro).format("DD/MM/YYYY"),
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
              <form onSubmit={handleSubmit(postCustomers)}>

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
                  label="statusIe"
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
          <Modal
            open={open}
            onClose={toggleModal}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <ModalRoot title="Editando Cliente" children={ 
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
              {/* <InputMask
                  mask="(99) 99999-9999"
                  {...register("telefone",  { required: "O telefone é obrigatório" })}
                >
                {() => (
                  <TextField
                  id="outlined-helperText"
                  label="telefone"
                  defaultValue=""
                  helperText={errors.telefone?.message || "Obrigatório"}
                  error={!!errors.telefone}
                  
                />
                )}
                </InputMask>  */}

              <TextField
                id="outlined-helperText"
                label="email"
                defaultValue=""
                helperText={errors.email?.message || "Obrigatório"}
                error={!!errors.email}
                {...register("email")}
              />
              
              <InputLabel id="demo-simple-select-label">Fornecedor ou Cliente</InputLabel>
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

                {/* <InputMask
                  mask="9999-9999"
                  {...register("cep")}>
                  {() => (
                  <TextField
                    id="outlined-helperText"
                    label="cep"
                    defaultValue=""
                    helperText={errors.cep?.message || "Obrigatório"}
                    error={!!errors.cep}/>)}
                </InputMask> */}

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
                  label="statusIe"
                  value={field.value} 
                >
                  <MenuItem value={true}>Contribuinte</MenuItem>
                  <MenuItem value={false}>Não Contribuinte</MenuItem>
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
      </MiniDrawer>
    </Box>
  );
};

export default Cliente;
