import { Box, Typography } from "@mui/material"
import { ReactNode } from "react"
import  { ModalStyle } from '../styles'
 
interface ModalRootProps {
    children: ReactNode;
}

export function ModalRoot({children}: ModalRootProps){
    return(
    
    <Box sx={ModalStyle}>
        
        <Typography id="modal-modal-title" variant="h6" component="h2">
            Editar Banco
        </Typography>

        {children}
    </Box>
        
)}