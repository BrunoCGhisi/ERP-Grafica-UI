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
  IconButton,
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
  nome: z.string(),
  valorTotal: z.number()
})

type bancoSchemaType = z.infer<typeof bancoSchema>

const Banco = () => {
  const [banks, setBanks] = useState<BankVO[]>([]);
  //const [bankId, setBankId] = useState<string>("");
  //const [nome, setNome] = useState<string>("");
  //const [valorTotal, setValorTotal] = useState<string>("");

  const {register, handleSubmit} = useForm<bancoSchemaType>({
    resolver:  zodResolver(bancoSchema)
  });

  function handleBancos(data: bancoSchemaType){
    console.log(data)
  }

  function sla(){
    console.log("aa")
  }
 
 // type bancoSchema = z.infer<typeof bancoSchema>

  // Modal ADD -----------------------------------------------------------------------------------------------------
  const [adopen, setAdOpen] = useState<boolean>(false);
  const addOn = () => setAdOpen(true);
  const addOf = () => setAdOpen(false);

  // Modal PUT -----------------------------------------------------------------------------------------------------
  // const [popen, setPOpen] = useState<boolean>(false);
  // const putOn = (id: string, nome: string, valorTotal: string) => {
  //   setBankId(id);
  //   setNome(nome);
  //   setValorTotal(valorTotal);

  //   setPOpen(true);
  // };
  // const putOf = () => setPOpen(false);

  // CRUD -----------------------------------------------------------------------------------------------------
  // async function getBanks() {
  //   try {
  //     const response = await axios.get("http://localhost:3000/banco");
  //     setBanks(response.data.bancos);
  //   } catch (error: any) {
  //     console.error(error);
  //   }
  // }

  // async function postBanks(handleBancos(bancoSchema)) {
  //   try {
  //     const response = await axios.post("http://localhost:3000/banco", {
  //     });
  //     if (response.status === 200) alert("Banco cadastrado com sucesso!");
  //     getBanks();
  //   } catch (error: any) {
  //     console.error(error);
  //   } finally {
  //     addOf();
  //   }
  // }

  // async function putBanks() {
  //   try {
  //     const response = await axios.put(
  //       `http://localhost:3000/banco?id=${bankId}`,
  //       {
  //         nome: nome,
  //         valorTotal: valorTotal,
  //       }
  //     );
  //     if (response.status === 200) alert("Usuário atualizado com sucesso!");
  //     getBanks();
  //   } catch (error: any) {
  //     console.error(error);
  //   } finally {
  //     putOf();
  //   }
  // }

  // async function delBanks(id: string) {
  //   try {
  //     const response = await axios.delete(
  //       `http://localhost:3000/banco?id=${id}`
  //     );
  //     if (response.status === 200) alert("Banco deletado com sucesso!");
  //     getBanks();
  //   } catch (error: any) {
  //     console.error(error);
  //   }
  // }

  // useEffect(() => {
  //   getBanks();
  // }, []);

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

              <form onSubmit={sla}>

              <TextField
                id="outlined-helperText"
                label="Nome"
                helperText="Obrigatório"
                {...register('nome')}
                
              />
              <TextField
                id="outlined-helperText"
                label="valorTotal"
                helperText="Obrigatório"
                {...register('valorTotal')}
              />

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

          {/* <Modal
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
                helperText="Obrigatório"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
              />
              <TextField
                id="outlined-helperText"
                label="valorTotal"
                helperText="Obrigatório"
                value={valorTotal}
                onChange={(e) => setValorTotal(e.target.value)}
              />

              <Button
                onClick={putBanks} // colcoar esse putbanks no form, tipar para submit
                variant="outlined"
                startIcon={<DoneIcon />}
              >
                Alterar
              </Button>
            </Box>
          </Modal> */}
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
