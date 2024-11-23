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
    UsuarioDataRow,
    usuarioSchemaType
} from "../../../shared/services/types";

import {
    getDeactiveUsers, putUser
} from "../../../shared/services";

interface ModalDeactivateUsuario {
    open: boolean
    toggleModal: () => void
    loadUsers: () => void
}

export function ModalDeactivateUsuario({open, loadUsers, toggleModal}: ModalDeactivateUsuario){

    const addOf = () => toggleModal();

    const [deactivate, setDeactivate] = useState<usuarioSchemaType[]>([]);
    const loadDeactives = async () => {
      const deactivatesData = await getDeactiveUsers();
     
      setDeactivate(deactivatesData);
      console.log(deactivatesData)
    };
    useEffect(() => {
      loadDeactives();
    }, [open]);
  

    const handleActivate = async (data: usuarioSchemaType) => {
        const desactivate = {...data, isActive: true}
        await putUser(desactivate);
        loadDeactives();
        loadUsers();
        
      };
      
      const columns: GridColDef<UsuarioDataRow>[] = [
        {
            field: "nome",
            headerName: "Nome",
            editable: false,
            flex: 0,
            width: 390,
            headerClassName: "gridHeader--header",
          },
          {
            field: "email",
            headerName: "Email",
            editable: false,
            flex: 0,
            width: 400,
            headerClassName: "gridHeader--header",
          },
          {
            field: "isAdm",
            headerName: "Administrador",
            editable: false,
            flex: 0,
            width: 110,
            headerClassName: "gridHeader--header",
            renderCell: ({ value }) => (value ? "Sim" : "Não"),
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
    
      const rows = deactivate.map((usuario) => ({
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        senha: usuario.senha,
        isAdm: usuario.isAdm,
        isActive: usuario.isActive
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