import { useState, useEffect } from "react";
import {
    Box,
    Modal, IconButton,
    Button
} from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { GridStyle, ModalStyle } from "../../../shared/styles";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import {
    BancoDataRow,
    bancoSchemaType
} from "../../../shared/services/types";

import {
    getDeactiveBanks, putBank
} from "../../../shared/services";

interface ModalDeactivateBanco {
    open: boolean
    toggleModal: () => void
    loadBanks: () => void
}

export function ModalDeactivateBanco({open, loadBanks, toggleModal,}: ModalDeactivateBanco){

  const addOf = () => toggleModal();

    const [deactivate, setDeactivate] = useState<bancoSchemaType[]>([]);
    const loadDeactives = async () => {
      const deactivatesData = await getDeactiveBanks();
      console.log(deactivatesData)
      setDeactivate(deactivatesData);
    };
    useEffect(() => {
      loadDeactives();
    }, [open]);
  

    const handleActivate = async (data: bancoSchemaType) => {
        const desactivate = {...data, isActive: true}
        await putBank(desactivate);
        loadBanks();
        loadDeactives();
      };

      

    const columns: GridColDef<BancoDataRow>[] = [
        {
            field: "nome",
            headerName: "Nome da Instituição Bancária",
            editable: false,
            flex: 0,
            minWidth: 700,
            maxWidth: 800,
            width: 700,
            headerClassName: "gridHeader--header",
          },
          {
            field: "valorTotal",
            headerName: "Saldo",
            editable: false,
            flex: 0,
      
            minWidth: 200,
            width: 200,
            maxWidth: 250,
            headerClassName: "gridHeader--header",
      
            renderCell: (params) => {
              const formattedValue = new Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
              }).format(params.value);
      
              return (
                <Box
                  sx={{
                    backgroundColor: params.value < 0 ? "error.light" : "transparent",
                    color: params.value < 0 ? "#fff" : "#000",
                    opacity: params.value < 0 ? "60%" : "100%",
                    width: "100%",
                    height: "100%",
                    display: "flex",
                  }}
                >
                  {formattedValue}
                </Box>
              );
            },
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
                <IconButton onClick={() => row.id !== undefined && handleActivate(row)}>
                  <AddCircleIcon />
                </IconButton>
              </div>
            ),
          },
        ];
      
        const rows = deactivate.map((banco) => ({
          id: banco.id,
          nome: banco.nome,
          valorTotal: banco.valorTotal,
          isActive: banco.isActive,
        }));
    
    return (
        <Box>
        <Modal
              open={open}
              onClose={addOf}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
            <Box sx={ModalStyle}>
            <Button
                    onClick={addOf}
                    variant="outlined"
                    startIcon={<CloseRoundedIcon />}
                />
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
        </Modal>
      </Box>
    )
}