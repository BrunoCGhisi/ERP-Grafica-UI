import { useState, useEffect } from "react";
import { PaymentWayVO } from "../services/types";
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
import { ModalStyle } from "./styles";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import DoneIcon from "@mui/icons-material/Done";


const FormaPgto = () => {

    const [paymentWays, setPaymentWays] = useState<PaymentWayVO[]>([]);
    const [paymentWayId, setPaymentWayId] = useState<string>("")
    const [tipo, setTipo]     = useState<string>("")
    const [idBanco, setIdBanco] = useState<string>("")

    // Modal ADD
  const [adopen, setAdOpen] = useState<boolean>(false);
  const addOn = () => setAdOpen(true);
  const addOf = () => setAdOpen(false);

  // Modal PUT
  const [popen, setPOpen] = useState<boolean>(false);
  const putOn = (id: string, tipo: string, idBanco: string) => {
    setPaymentWayId(id);
    setTipo(tipo);
    setIdBanco(idBanco);

    setPOpen(true);
  };
  const putOf = () => setPOpen(false);

  async function getPaymentWays() {
    try {
      const response = await axios.get("http://localhost:3000/formas_pgto");
      setPaymentWays(response.data.formas_pgto);
    } catch (error: any) {
      console.error(error);
    }
  }

  async function postPaymentWays() {
    try {
      const response = await axios.post("http://localhost:3000/formas_pgto", {
        tipo: tipo,
        idBanco: idBanco,
      });
      if (response.status === 200) alert("forma_pgto cadastrado com sucesso!");
      getPaymentWays();
    } catch (error: any) {
      console.error(error);
    } finally {
      addOf();
    }
  }

  async function putPaymentWays() {
    try {
      const response = await axios.put(
        `http://localhost:3000/formas_pgto?id=${paymentWayId}`,
        {
          tipo: tipo,
          idBanco: idBanco,
          
        }
      );
      if (response.status === 200) alert("Usuário atualizado com sucesso!");
      getPaymentWays();
    } catch (error: any) {
      console.error(error);
    } finally {
      putOf();
    }
  }

  async function delPaymentWays(id: string) {
    try {
      const response = await axios.delete(`http://localhost:3000/formas_pgto?id=${id}`);
      if (response.status === 200) alert("forma_pgto deletado com sucesso!");
      getPaymentWays();
    } catch (error: any) {
      console.error(error);
    }
  }

  useEffect(() => {
    getPaymentWays();
  }, []);

  const columns: GridColDef<PaymentWayVO>[] = [
    { field: "id", headerName: "ID", align: "left", flex: 0 },
    { field: "tipo", headerName: "Tipo", editable: false, flex: 0 },
    { field: "idBanco", headerName: "IdBanco", editable: false, flex: 0 },

    {
      field: "acoes",
      headerName: "Ações",
      width: 150,
      align: "center",
      type: "actions",
      flex: 0,
      renderCell: ({ row }) => (
        <div>
          <IconButton onClick={() => delPaymentWays(row.id)}>
            <DeleteIcon />
          </IconButton>
          <IconButton onClick={() => putOn(row.id, row.tipo, row.idBanco)}>
            <EditIcon />
          </IconButton>
        </div>
      ),
    },
  ];

  const rows = paymentWays.map((forma_pgto) => ({
    id: forma_pgto.id,
    tipo: forma_pgto.tipo,
    idBanco: forma_pgto.idBanco,

  }));
  
    return (
        <Box>
            <Typography>Estamos dentro do banco </Typography>
            <Typography>(Não iremos cometer nenhum assalto...)</Typography>
            <Box>
        <Stack direction="row" spacing={2}>
          <Button onClick={addOn} variant="outlined" startIcon={<AddCircleOutlineIcon />}>
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
            <TextField
              id="outlined-helperText"
              label="Tipo"
              helperText="Obrigatório"
              value={tipo}
              onChange={(e) => setTipo(e.target.value)}
            />
            <TextField
              id="outlined-helperText"
              label="idBanco"
              helperText="Obrigatório"
              value={idBanco}
              onChange={(e) => setIdBanco(e.target.value)}
            />
    
            <Button
              onClick={postPaymentWays}
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
              label="Tipo"
              helperText="Obrigatório"
              value={tipo}
              onChange={(e) => setTipo(e.target.value)}
            />
            <TextField
              id="outlined-helperText"
              label="idBanco"
              helperText="Obrigatório"
              value={idBanco}
              onChange={(e) => setIdBanco(e.target.value)}
            />
        
            <Button
              onClick={putPaymentWays}
              variant="outlined"
              startIcon={<DoneIcon />}
            >
              Alterar
            </Button>
          </Box>
        </Modal>
      </Box>
      <Box>
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
        
    )
}

export default FormaPgto;