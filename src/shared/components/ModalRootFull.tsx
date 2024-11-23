import { Box, Typography } from "@mui/material";
import { ReactNode, forwardRef } from "react";
import { ModalStyle } from "../styles";

interface ModalRootProps {
  children: ReactNode;
  sx?: object;

}

export const ModalRootFull = forwardRef<HTMLDivElement, ModalRootProps>(
  ({ children }, ref) => (
    <Box sx={{ ...ModalStyle, width: "80%", height: "80vh" }} ref={ref}>
      {children}
    </Box>
  )
);