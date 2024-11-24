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
    proCategorySchemaType,
    ProductCategoryDataRow
} from "../../../shared/services/types";

import {
    getDeactiveCategories, putCategories
} from "../../../shared/services";

interface ModalDeactivateCatProd {
    open: boolean
    toggleModal: () => void
    loadProductCategories: () => void
}

export function ModalDeactivateCatProd({open, loadProductCategories, toggleModal,}: ModalDeactivateCatProd){

    const addOf = () => toggleModal();

    const [deactivate, setDeactivate] = useState<proCategorySchemaType[]>([]);
    const loadDeactives = async () => {
      const deactivatesData = await getDeactiveCategories();
      setDeactivate(deactivatesData);
    };
    useEffect(() => {
      loadDeactives();
    }, [open]);
  

    const handleActivate = async (data: proCategorySchemaType) => {
        const desactivate = {...data, isActive: true}
        await putCategories(desactivate);
        loadProductCategories();
        loadDeactives();
      };

    const columns: GridColDef<ProductCategoryDataRow>[] = [
        {
            field: "categoria",
            headerName: "Categoria",
            editable: false,
            flex: 0,
            width: 900,
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
              <IconButton onClick={() => row.id !== undefined && handleActivate(row)}>
                <AddCircleIcon />
              </IconButton>
            </div>
          ),
        },
      ];
    
      const rows = deactivate.map((prodCat) => ({
        id: prodCat.id,
        categoria: prodCat.categoria,
        isActive: prodCat.isActive,
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