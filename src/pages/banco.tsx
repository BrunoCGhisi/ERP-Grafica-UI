import { useState, useEffect } from "react";

import { BankVO } from "../services/types";
import axios from "axios";
import {
  Box,
  Modal,
  Button,
  Typography,
  TextField,
  Stack,
  IconButton

} from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { ModalStyle, GridStyle, SpaceStyle } from "./styles";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import DoneIcon from "@mui/icons-material/Done";
import { MiniDrawer } from "../components";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";


const bancoSchema = z.object({
  id: z.string(),
  nome: z.string(),
  valorTotal: z.string()
})

type bancoSchemaType = z.infer<typeof bancoSchema>

const Banco = () => {
  const [banks, setBanks] = useState<BankVO[]>([]);
  //const [bankId, setBankId] = useState<string>("");
  //const [nome, setNome] = useState<string>("");
  //const [valorTotal, setValorTotal] = useState<string>("");

  const [output, setOutput] = useState('');
  const [selected, setSelected] = useState<string | null>(null);


  const {register, handleSubmit, formState: {errors}} = useForm<bancoSchemaType>({
    resolver:  zodResolver(bancoSchema)
  });
  


  // const handleBancos = (data: bancoSchemaType) => {
  //   console.log("adata", data)
  // }

 
 // type bancoSchema = z.infer<typeof bancoSchema>

  // Modal ADD -----------------------------------------------------------------------------------------------------
  const [adopen, setAdOpen] = useState<boolean>(false);
  const addOn = () => setAdOpen(true);
  const addOf = () => setAdOpen(false);

  // Modal PUT -----------------------------------------------------------------------------------------------------
   const [popen, setPOpen] = useState<boolean>(false);
   const putOn = (id: string) => {
      setSelected(id);
     setPOpen(true);
   };
   const putOf = () => setPOpen(false);

   //CRUD -----------------------------------------------------------------------------------------------------
   async function getBanks() {
     try {
       const response = await axios.get("http://localhost:3000/banco");
       setBanks(response.data.bancos);
     } catch (error: any) {
       console.error(error);
     }
   }

    async function postBanks(data: bancoSchemaType) {
      try {
        const response = await axios.post("http://localhost:3000/banco", data);
        if (response.status === 200) alert("Banco cadastrado com sucesso!");
        getBanks();
      } catch (error: any) {
        console.error(error);
      } finally {
        addOf();
      }
    }

  async function putBanks(data: bancoSchemaType, id: string) {
    try {
      const response = await axios.put(
        `http://localhost:3000/banco?id=${id}`, data);
      if (response.status === 200) alert("Usuário atualizado com sucesso!");
      getBanks();
    } catch (error: any) {
      console.error(error);
    } finally {
      putOf();
    }
  }

   async function delBanks(id: string) {
     try {
       const response = await axios.delete(
         `http://localhost:3000/banco?id=${id}`
       );
       if (response.status === 200) alert("Banco deletado com sucesso!");
       getBanks();
     } catch (error: any) {
       console.error(error);
     }
   }

   useEffect(() => {
     getBanks();
   }, []);

  const columns: GridColDef<BankVO>[] = [
    { field: "id", headerName: "ID", align: "left", flex: 0 },
    { field: "nome", headerName: "Nome", editable: false, flex: 0 },
    { field: "valorTotal", headerName: "valorTotal", editable: false, flex: 0 },

    {
      field: "acoes",
      headerName: "Ações",
      width: 150,
      align: "center",
      type: "actions",
      flex: 0,
      renderCell: ({ row }) => (
        <div>
         <IconButton onClick={() => delBanks(row.id)}>
            <DeleteIcon />
          </IconButton>
          <IconButton onClick={() => putOn(row.id, row.nome, row.valorTotal)}>
            <EditIcon />
          </IconButton> 
        </div>
      ),
    },
  ];

  const rows = banks.map((banco) => ({
    id: banco.id,
    nome: banco.nome,
    valorTotal: banco.valorTotal,
  }));

  return (
    <Box>
      <MiniDrawer />
      <Box sx={SpaceStyle}>
        <Typography>Estamos dentro do banco </Typography>
        <Typography>(Não iremos cometer nenhum assalto...)</Typography>
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
                Novo banco
              </Typography>

              <form onSubmit={handleSubmit(postBanks)}>

              <TextField
                id="outlined-helperText"
                label="Nome"
                helperText={errors.nome?.message || "Obrigatório"}
                error={!!errors.nome} 
                {...register('nome')}
                
              />
              <TextField
                id="outlined-helperText"
                label="valorTotal"
                helperText={errors.valorTotal?.message || "Obrigatório"}
                error={!!errors.valorTotal} 
                {...register('valorTotal', {valueAsNumber: true})}
              />

                <Button  
                
                  type="submit" 
                  variant="outlined"
                  startIcon={<DoneIcon />}
                  
                >
                  Cadastrar
                </Button>
              </form>

              <pre>{output}</pre>

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
              <form onSubmit={handleSubmit(putBanks)}>
              <TextField
                id="outlined-helperText"
                label="Nome"
                helperText={errors.nome?.message || "Obrigatório"}
                error={!!errors.nome} 
                {...register('nome')}
              />
              <TextField
                id="outlined-helperText"
                label="valorTotal"
                helperText={errors.valorTotal?.message || "Obrigatório"}
                error={!!errors.valorTotal} 
                {...register('valorTotal')}
              />

              <Button
                type="submit" // colcoar esse putbanks no form, tipar para submit
                variant="outlined"
                startIcon={<DoneIcon />}
              >
                Alterar
              </Button>
              </form>
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

export default Banco;
