import { useState, useEffect } from "react";
import { PurchaseVO } from "../services/types";
import axios from "axios";
import {
  Box,
  Modal,
  InputLabel,
  Select,
  Button,
  Typography,
  TextField,
  Stack,
  IconButton,
  MenuItem,
} from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { ModalStyle, GridStyle, SpaceStyle } from "./styles";
import { MiniDrawer } from "../components";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import DoneIcon from "@mui/icons-material/Done";

const Compra = () => {
  const [purchases, setPurchases] = useState<PurchaseVO[]>([]);
  const [purchaseId, setPurchaseId] = useState<string>("");
  const [idFornecedor, setIdFornecedor] = useState<string>("");
  const [isCompraOS, setIsCompraOS] = useState<string>("");
  const [dataCompra, setDataCompra] = useState<string>("");
  const [numNota, setNumNota] = useState<string>("");
  const [desconto, setDesconto] = useState<string>("");

  // Modal ADD
  const [adopen, setAdOpen] = useState<boolean>(false);
  const addOn = () => setAdOpen(true);
  const addOf = () => setAdOpen(false);

  // Modal PUT
  const [popen, setPOpen] = useState<boolean>(false);
  const putOn = (
    id: string,
    idFornecedor: string,
    isCompraOS: string,
    dataCompra: string,
    numNota: string,
    desconto: string
  ) => {
    setPurchaseId(id);
    setIdFornecedor(idFornecedor);
    setIsCompraOS(isCompraOS);
    setDataCompra(dataCompra);
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
        idFornecedor: idFornecedor,
        isCompraOS: isCompraOS,
        dataCompra: dataCompra,
        numNota: numNota,
        desconto: desconto,
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
          idFornecedor: idFornecedor,
          isCompraOS: isCompraOS,
          dataCompra: dataCompra,
          numNota: numNota,
          desconto: desconto,
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
      const response = await axios.delete(
        `http://localhost:3000/compra?id=${id}`
      );
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
    { field: "id", headerName: "id", editable: false, flex: 0 },
    {
      field: "idFornecedor",
      headerName: "IdFornecedor",
      editable: false,
      flex: 0,
    },
    { field: "isCompraOS", headerName: "IsCompraOS", editable: false, flex: 0 },
    { field: "dataCompra", headerName: "DataCompra", editable: false, flex: 0 },
    { field: "numNota", headerName: "NumNota", editable: false, flex: 0 },
    { field: "desconto", headerName: "Desconto", editable: false, flex: 0 },

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
          <IconButton
            onClick={() =>
              putOn(
                row.id,
                row.idFornecedor,
                row.isCompraOS,
                row.dataCompra,
                row.numNota,
                row.desconto
              )
            }
          >
            <EditIcon />
          </IconButton>
        </div>
      ),
    },
  ];

  const rows = purchases.map((compra) => ({
    id: compra.id,
    idFornecedor: compra.idFornecedor,
    isCompraOS: compra.isCompraOS,
    dataCompra: compra.dataCompra,
    numNota: compra.numNota,
    desconto: compra.desconto,
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

              <TextField
                id="outlined-idFornecedor"
                label="ID Fornecedor"
                helperText="Obrigatório"
                value={idFornecedor}
                onChange={(e) => setIdFornecedor(e.target.value)}
              />
              <InputLabel id="demo-simple-select-label">
                Compra ou OS
              </InputLabel>

              <Select
                labelId="select-label"
                id="demo-simple-select"
                value={isCompraOS}
                label="isCompraOS"
                onChange={(e) => setIsCompraOS(e.target.value)}
              >
                <MenuItem value={0}>Compra</MenuItem>
                <MenuItem value={1}>OS </MenuItem>
              </Select>
              <TextField
                id="outlined-dataCompra"
                label="Data Compra"
                helperText="Obrigatório"
                value={dataCompra}
                onChange={(e) => setDataCompra(e.target.value)}
              />
              <TextField
                id="outlined-numNota"
                label="Número da Nota"
                helperText="Obrigatório"
                value={numNota}
                onChange={(e) => setNumNota(e.target.value)}
              />
              <TextField
                id="outlined-desconto"
                label="Desconto"
                helperText="Obrigatório"
                value={desconto}
                onChange={(e) => setDesconto(e.target.value)}
              />

              <Button
                onClick={postPurchases}
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
                id="outlined-idFornecedor"
                label="ID Fornecedor"
                helperText="Obrigatório"
                value={idFornecedor}
                onChange={(e) => setIdFornecedor(e.target.value)}
              />

              <InputLabel id="demo-simple-select-label">
                Compra ou OS
              </InputLabel>

              <Select
                labelId="select-label"
                id="demo-simple-select"
                value={isCompraOS}
                label="isCompraOS"
                onChange={(e) => setIsCompraOS(e.target.value)}
              >
                <MenuItem value={0}>Compra</MenuItem>
                <MenuItem value={1}>OS </MenuItem>
              </Select>

              <TextField
                id="outlined-dataCompra"
                label="Data Compra"
                helperText="Obrigatório"
                value={dataCompra}
                onChange={(e) => setDataCompra(e.target.value)}
              />
              <TextField
                id="outlined-numNota"
                label="Número da Nota"
                helperText="Obrigatório"
                value={numNota}
                onChange={(e) => setNumNota(e.target.value)}
              />
              <TextField
                id="outlined-desconto"
                label="Desconto"
                helperText="Obrigatório"
                value={desconto}
                onChange={(e) => setDesconto(e.target.value)}
              />

              <Button
                onClick={putPurchases}
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

export default Compra;
