import { useState, useEffect } from "react";
import {
  Box, IconButton, Typography,
  Grid,
  Alert
} from "@mui/material";
import { DataGrid, GridColDef, GridLocaleText } from "@mui/x-data-grid";
import { GridStyle, SpaceStyle } from "../../shared/styles";
import { MiniDrawer } from "../../shared/components";

import EditIcon from "@mui/icons-material/Edit";

import { zodResolver } from "@hookform/resolvers/zod";
import { useOpenModal } from "../../shared/hooks/useOpenModal";
import { useForm } from "react-hook-form";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import {
  financiaSchema,
  financiaSchemaType,
  FinanciaDataRow,
  bancoSchemaType
} from "../../shared/services/types";

import { getBanks, getFinances } from "../../shared/services";
import { ModalEditFinanceiro } from "./components/modal-edit-fin";
import { ModalGetFinanceiro } from "./components/modal-get-fin";
import dayjs from "dayjs";

const Financeiro = () => {
  const {
    reset,
  } = useForm<financiaSchemaType>({
    resolver: zodResolver(financiaSchema),
  });
  const [finances, setFinances] = useState<financiaSchemaType[]>([]);
  const [banks, setBanks] = useState<bancoSchemaType[]>([]);

  const { toggleModal, open } = useOpenModal();
  const toggleGetModal = useOpenModal();
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [idToEdit, setIdToEdit] = useState<any>(null);
  const [selectedRow, setSelectedRow] = useState<FinanciaDataRow>();

  const handleRowClick = (params: FinanciaDataRow) => {
    setSelectedRow(params);
    toggleGetModal.toggleModal();
  };

  //CRUD -----------------------------------------------------------------------------------------------------

  const loadFinances = async () => {
    const FinancesData = await getFinances();
    const BanksData = await getBanks();
    setBanks(BanksData)
    setFinances(FinancesData);
  };
  useEffect(() => {
    loadFinances();
  }, [open]);

  useEffect(() => {
    getFinances();
  }, []);

  const situacaoNome = (situacaoData: number | undefined) => {
    switch (situacaoData) {
      case 0:
        return "Orçamento ";
      case 2:
        return "À receber";
      case 3:
        return "Pago";
      case 4:
        return "Recebido";
      case 1:
        return "À pagar";
    }
  };

  const columns: GridColDef<FinanciaDataRow>[] = [
    { field: "descricao", headerName: "Descrição", editable: false, flex: 0, minWidth: 300, headerClassName: "gridHeader--header", },
    { field: "dataVencimento", headerName: "Vencimento", editable: false, flex: 0, width: 150, minWidth: 95, headerClassName: "gridHeader--header", },
    { field: "situacao", headerName: "Status", editable: false, flex: 0, width: 150, headerClassName: "gridHeader--header",
      renderCell: (params) => <span>{situacaoNome(params.value)}</span> },
    { field: "valor", headerName: "Valor Total", editable: false, flex: 0, width: 100, minWidth: 100, headerClassName: "gridHeader--header", },

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
          <IconButton onClick={() => row.id !== undefined && [setIdToEdit(row.id), toggleModal()]}>
            <EditIcon />
          </IconButton>
          <IconButton onClick={() => handleRowClick(row)}>
            <OpenInNewIcon color="primary" />
          </IconButton>
        </div>
      ),
    },
  ];

  const rows = finances.map((financeiro) => ({
    id: financeiro.id,
    descricao: financeiro.descricao,
    idVenda: financeiro.idVenda,
    idFormaPgto: financeiro.idFormaPgto,
    idBanco: financeiro.idBanco,
    isPagarReceber: financeiro.isPagarReceber,
    valor: financeiro.valor,
    dataVencimento: dayjs(financeiro.dataVencimento).format("DD/MM/YYYY"),
    dataCompetencia: dayjs( financeiro.dataCompetencia).format("DD/MM/YYYY"),
    dataPagamento: financeiro.dataPagamento && dayjs( financeiro.dataPagamento).format("DD/MM/YYYY") || "",
    situacao: financeiro.situacao,
    parcelas: financeiro.parcelas,
  }));

  const localeText: Partial<GridLocaleText> = {
    toolbarDensity: "Densidade",
    toolbarColumns: "Colunas",
    footerRowSelected: (count) => "", // Remove a mensagem "One row selected"
  };

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

{/*---------------------------------- MODAL -------------------------------------- */}
            {open && (
              <ModalEditFinanceiro                         
                open={open}             
                setAlertMessage={setAlertMessage}
                setShowAlert={setShowAlert}
                toggleModal={toggleModal}
                idToEdit={idToEdit}
                finances={finances}
                loadFinances={loadFinances}

              />
            )}
            {toggleGetModal.open && (
              <ModalGetFinanceiro
                bancos={banks}
                financeiros={finances}
                rowData={selectedRow}
                open={toggleGetModal.open}
                toggleModal={toggleGetModal.toggleModal}
              />
            )}

            
          </Grid>
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

export default Financeiro;
  