import { Box, Typography } from "@mui/material"
import { ReactNode } from "react"
import  { ModalStyle } from '../styles'
 
interface ModalRootProps {
    children: ReactNode;
    title: string;
}

export function ModalRoot({children, title}: ModalRootProps){
    return(
    <Box sx={ModalStyle}>
        <Typography id="modal-modal-title" variant="h6" component="h2">
            {title}
        </Typography>
        {children}
    </Box>
        
)}