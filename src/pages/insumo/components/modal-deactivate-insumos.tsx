import { useState, useEffect } from "react";
import {
  Box,
  Modal, IconButton
} from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { GridStyle, ModalStyle } from "../../../shared/styles";
import AddCircleIcon from '@mui/icons-material/AddCircle';

import {
  InsumoDataRow,
  insumoSchemaType
} from "../../../shared/services/types";

import {
  getDeactives, putSupplie
} from "../../../shared/services";

interface ModalDeactivateInsumo {
    open: boolean
    toggleModal: () => void
    loadSupplies: () => void
}

export function ModalDeactivateInsumo({open, loadSupplies, toggleModal,}: ModalDeactivateInsumo){

    const [deactivate, setDeactivate] = useState<insumoSchemaType[]>([]);
    const loadDeactives = async () => {
      const deactivatesData = await getDeactives();
      setDeactivate(deactivatesData);
    };
    useEffect(() => {
      loadDeactives();
    }, [open]);
  

    const handleActivate = async (data: insumoSchemaType) => {
        const desactivate = {...data, isActive: true}
        await putSupplie(desactivate);
        loadSupplies();
        toggleModal()
      };

      

    const columns: GridColDef<InsumoDataRow>[] = [
    
        { field: "nome", headerName: "Nome", editable: false, flex: 0, width: 500, minWidth: 500, headerClassName: "gridHeader--header", },
        { field: "estoque", headerName: "Estoque", editable: false, flex: 0, width: 200, minWidth: 200, headerClassName: "gridHeader--header", },
        { field: "isActive", headerName: "Status", editable: false, flex: 0, width: 200, minWidth: 200, headerClassName: "gridHeader--header", valueGetter: ({ value }) => (value ? "Desativado" : "Ativo"),
        },
        { field: "valorM2", headerName: "Valor Metro Quadrado", editable: false, flex: 0, width: 200, minWidth: 200, headerClassName: "gridHeader--header", renderCell: (params) => {
          const formattedValue = new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
          }).format(params.value);
          return <span>{formattedValue}</span>;
        },},
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
    
      const rows = deactivate.map((supplie) => ({
        id: supplie.id,
        nome: supplie.nome,
        estoque: supplie.estoque,
        isActive: supplie.isActive,
        valorM2: supplie.valorM2,
      }));
    
    return (
        <Box>
        <Modal
              open={open}
              onClose={toggleModal}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
            <Box sx={ModalStyle}>
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