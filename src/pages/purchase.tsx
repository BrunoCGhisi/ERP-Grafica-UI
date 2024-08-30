import { useState, useEffect } from "react";
import { PurchaseVO } from "../services/types";
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


const Compra = () => {

    const [purchases, setPurchases] = useState<PurchaseVO[]>([]);
    const [purchaseId, setPurchaseId] = useState<string>("")
    const [idFornecedor, setIdFornecedor]     = useState<string>("")
    const [idCompraOS, setidCompraOS] = useState<string>("")
    const [dataCompra, setDataCompra] = useState<string>("")
    const [numNota, setNumNota] = useState<string>("")
    const [desconto, setDesconto] = useState<string>("")

    // Modal ADD
  const [adopen, setAdOpen] = useState<boolean>(false);
  const addOn = () => setAdOpen(true);
  const addOf = () => setAdOpen(false);

  // Modal PUT
  const [popen, setPOpen] = useState<boolean>(false);
  const putOn = (id: string, idFornecedor: string, idCompraOS: string, dataCompra: string,numNota: string, desconto: string) => {
    setPurchaseId(id);
    setIdFornecedor(idFornecedor);
    setidCompraOS(idCompraOS);
    setDataCompra(dataCompra)
    setNumNota(numNota);
    setDesconto(desconto);

    setPOpen(true);
  };
  const putOf = () => setPOpen(false);

  async function getPurchases() {
    try {
      const response = await axios.get("http://localhost:3000/compra");
      setPurchases(response.data.compras);
    } catch (error: any) {
      console.error(error);
    }
  }

  async function postPurchases() {
    try {
      const response = await axios.post("http://localhost:3000/compra", {
        tipo: tipo,
        idBanco: idBanco,
      });
      if (response.status === 200) alert("compra cadastrado com sucesso!");
      getPurchases();
    } catch (error: any) {
      console.error(error);
    } finally {
      addOf();
    }
  }

  async function putPurchases() {
    try {
      const response = await axios.put(
        `http://localhost:3000/compra?id=${purchaseId}`,
        {
          tipo: tipo,
          idBanco: idBanco,
          
        }
      );
      if (response.status === 200) alert("COmpra atualizado com sucesso!");
      getPurchases();
    } catch (error: any) {
      console.error(error);
    } finally {
      putOf();
    }
  }

  async function delPurchases(id: string) {
    try {
      const response = await axios.delete(`http://localhost:3000/compra?id=${id}`);
      if (response.status === 200) alert("compra deletado com sucesso!");
      getPurchases();
    } catch (error: any) {
      console.error(error);
    }
  }

  useEffect(() => {
    getPurchases();
  }, []);

  const columns: GridColDef<PurchaseVO>[] = [
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
          <IconButton onClick={() => delPurchases(row.id)}>
            <DeleteIcon />
          </IconButton>
          <IconButton onClick={() => putOn(row.id, row.tipo, row.idBanco)}>
            <EditIcon />
          </IconButton>
        </div>
      ),
    },
  ];

  const rows = purchases.map((compra) => ({
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
              onClick={postBanks}
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
              onClick={putBanks}
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

export default Compra;