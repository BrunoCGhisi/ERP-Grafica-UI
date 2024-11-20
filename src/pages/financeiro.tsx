import { useState, useEffect } from "react";
import axios from "axios";
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
  Grid
} from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { ModalStyle, GridStyle, SpaceStyle } from "../shared/styles";
import { MiniDrawer } from "../shared/components";

import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import DoneIcon from "@mui/icons-material/Done";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ModalRoot } from "../shared/components/ModalRoot";
import { useOpenModal } from "../shared/hooks/useOpenModal";
import { Controller, useForm } from "react-hook-form";

import {
  financiaSchema,
  financiaSchemaType,
  FinanciaDataRow,
  financeiroSchemaType,
} from "../shared/services/types";

import { getFinances, postFinances, putFinances, deleteFinances } from "../shared/services";

const Financeiro = () => {
  const {
    register,
    setValue,
    reset,
    control,
    formState: { errors },
    handleSubmit,
  } = useForm<financiaSchemaType>({
    resolver: zodResolver(financiaSchema),
  });
  const [finances, setFinances] = useState<financiaSchemaType[]>([]);
  const [selectedData, setSelectedData] = useState<FinanciaDataRow | null>(
    null
  );
  const { toggleModal, open } = useOpenModal();

  const handleEdit = (updateDate: FinanciaDataRow) => {
    setSelectedData(updateDate);
    toggleModal();
  };

  // Modal ADD
  const [adopen, setAdOpen] = useState<boolean>(false);
  const addOn = () => {
    setAdOpen(true), reset();
  };
  const addOf = () => setAdOpen(false);

  useEffect(() => {
    if (selectedData) {
      setValue("id", selectedData.id);
      setValue("idVenda", selectedData.idVenda);
      setValue("idBanco", selectedData.idBanco);
      setValue("descricao", selectedData.descricao);
      setValue("isPagarReceber", selectedData.isPagarReceber);
      setValue("valor", selectedData.valor);
      setValue("dataVencimento", selectedData.dataVencimento);
      setValue("dataCompetencia", selectedData.dataCompetencia);
      setValue("dataPagamento", selectedData.dataPagamento);
      setValue("situacao", selectedData.situacao);
      setValue("parcelas", selectedData.parcelas);
    }
  }, [selectedData, setValue]);

  //CRUD -----------------------------------------------------------------------------------------------------

  const loadFinances = async () => {
    const FinancesData = await getFinances();
    setFinances(FinancesData);
  };

  const handleAdd = async (data: financiaSchemaType) => {
    await postFinances(data);
    loadFinances();
    setAdOpen(false);
  };

  const handleUpdate = async (data: financiaSchemaType) => {
    await putFinances(data);
    loadFinances();
    toggleModal();
  };

  const handleDelete = async (id: number) => {
    await deleteFinances(id);
    loadFinances();
  };

  useEffect(() => {
    loadFinances();
  }, [open]);

  useEffect(() => {
    getFinances();
  }, []);

  const columns: GridColDef<FinanciaDataRow>[] = [
    { field: "descricao", headerName: "Descrição", editable: false, flex: 0, minWidth: 150, headerClassName: "gridHeader--header", },
    { field: "idBanco", headerName: "Banco", editable: false, flex: 0, minWidth:100, headerClassName: "gridHeader--header", },
    {field: "isPagarReceber",headerName: "À Pagar",editable: false,flex: 0, minWidth: 70, width: 70, headerClassName: "gridHeader--header", },
    { field: "valor", headerName: "Valor Total", editable: false, flex: 0, width: 100, minWidth: 100, headerClassName: "gridHeader--header", },
    { field: "dataVencimento", headerName: "Vencimento", editable: false, flex: 0, width: 95, minWidth: 95, headerClassName: "gridHeader--header", },
    { field: "dataCompetencia",headerName: "Competencia",editable: false,flex: 0, minWidth: 103, headerClassName: "gridHeader--header",},
    { field: "dataPagamento", headerName: "Pagamento", editable: false, flex: 0, width: 95, minWidth: 95, headerClassName: "gridHeader--header", },
    { field: "situacao", headerName: "Status", editable: false, flex: 0, width: 90, headerClassName: "gridHeader--header", },
    { field: "parcelas", headerName: "N° Parcelas", editable: false, flex: 0, width: 100, headerClassName: "gridHeader--header",},
    {
      field: "acoes",
      headerName: "Ações",
      width: 150,
      align: "center",
      type: "actions",
      headerClassName: "gridHeader--header",
      flex: 0,
      renderCell: ({ row }) => (
        <div>
          <IconButton
            onClick={() => row.id !== undefined && handleDelete(row.id)}
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

  const rows = finances.map((financeiro) => ({
    id: financeiro.id,
    descricao: financeiro.descricao,
    idVenda: financeiro.idVenda,
    idBanco: financeiro.idBanco,
    isPagarReceber: financeiro.isPagarReceber,
    valor: financeiro.valor,
    dataVencimento: financeiro.dataVencimento,
    dataCompetencia: financeiro.dataCompetencia,
    dataPagamento: financeiro.dataPagamento,
    situacao: financeiro.situacao,
    parcelas: financeiro.parcelas,
  }));
  useEffect(() => {
    reset();
  }, [ reset]);

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
              <Typography variant="h6">Financeiro</Typography>
            </Grid>
          </Grid>
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

export default Financeiro;
