import { Box, Typography } from "@mui/material";
import { ReactNode, forwardRef } from "react";
import { ModalStyle } from "../styles";

interface ModalRootProps {
  children: ReactNode;
  title: string;
}

export const ModalRoot = forwardRef<HTMLDivElement, ModalRootProps>(
  ({ title, children }, ref) => (
    <Box sx={ModalStyle} ref={ref}>
      <Typography id="modal-modal-title" variant="h6" component="h2">
        {title}
      </Typography>
      {children}
    </Box>
  )
);
