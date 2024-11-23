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
    ProdutoDataRow,
    produtoSchemaType
} from "../../../shared/services/types";

import {
    getProductsDeactivate, putProducts
} from "../../../shared/services";

interface ModalDeactivateProduto {
    open: boolean
    toggleModal: () => void
    loadProducts: () => void
    getInsumoNome: (id: number | undefined) => string
    getCategoriaNome: (id: number | undefined) => string
}

export function ModalDeactivateProduto({open, loadProducts, toggleModal, getInsumoNome, getCategoriaNome}: ModalDeactivateProduto){

    const addOf = () => toggleModal();

    const [deactivate, setDeactivate] = useState<produtoSchemaType[]>([]);
    const loadDeactives = async () => {
      const deactivatesData = await getProductsDeactivate();
     
      setDeactivate(deactivatesData);
      console.log(deactivatesData)
    };
    useEffect(() => {
      loadDeactives();
    }, [open]);
  

    const handleActivate = async (data: produtoSchemaType) => {
        const desactivate = {...data, isActive: true}
        await putProducts(desactivate);
        loadProducts();
        loadDeactives();
      };
      
      const columns: GridColDef<ProdutoDataRow>[] = [
        {field: "nome", headerName: "Nome", editable: false, flex: 0, minWidth: 150, width: 150, headerClassName: "gridHeader--header",},
        {field: "keyWord", headerName: "Palavra Chave", editable: false, flex: 0, minWidth: 150, width: 150, headerClassName: "gridHeader--header",},
        {field: "tipo", headerName: "Tipo", editable: false, flex: 0, minWidth: 70, width: 100, headerClassName: "gridHeader--header", valueGetter: ({ value }) => (value ? "Serviço" : "Produto"),},
        {field: "idCategoria", headerName: "Categoria", editable: false, flex: 0, minWidth: 100, width: 100, headerClassName: "gridHeader--header", renderCell: (params) => <span>{getCategoriaNome(params.value)}</span>,},
        {field: "idInsumo", headerName: "Insumo", editable: false, flex: 0, minWidth: 130, width: 110, headerClassName: "gridHeader--header", renderCell: (params) => <span>{getInsumoNome(params.value)}</span>,},
        {field: "largura", headerName: "Largura", editable: false, flex: 0, minWidth: 70, width: 70, headerClassName: "gridHeader--header", renderCell: (params) => <span>{params.value} cm</span>,},
        {field: "comprimento", headerName: "Comprimento", editable: false, flex: 0, minWidth: 110, width: 110, headerClassName: "gridHeader--header", renderCell: (params) => <span>{params.value} cm</span>,},
        {field: "acoes", headerName: "Ações", width: 150, minWidth: 150, align: "center", type: "actions", flex: 0, headerClassName: "gridHeader--header",
      renderCell: ({ row }) => (
            <div>
              <IconButton onClick={() => row.id !== undefined && handleActivate(row)}>
                <AddCircleIcon />
              </IconButton>
            </div>
          ),
        },
      ];
    
      const rows = deactivate.map((produto) => ({
        id: produto.id,
        nome: produto.nome,
        tipo: produto.tipo,
        keyWord: produto.keyWord,
        idCategoria: produto.idCategoria,
        idInsumo: produto.idInsumo,
        largura: produto.largura,
        comprimento: produto.comprimento,
        isActive: produto.isActive == true ? 'Ativo' : 'Inativo'
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