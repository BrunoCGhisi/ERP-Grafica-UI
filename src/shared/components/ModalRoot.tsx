import { Box, Typography } from "@mui/material";
import { ReactNode, forwardRef } from "react";
import { ModalStyle } from "../styles";

interface ModalRootProps {
  children: ReactNode;

}

export const ModalRoot = forwardRef<HTMLDivElement, ModalRootProps>(
  ({ children }, ref) => (
    <Box sx={ModalStyle} ref={ref}>
      {children}
    </Box>
  )
);
