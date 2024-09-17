import { useState, useEffect } from "react";
import { ProductCategoryVO } from "../services/types";
import axios from "axios";
import {
  Box,
  Modal,
  Button,
  Typography,
  TextField,
  Stack,
  IconButton,
} from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { ModalStyle, GridStyle, SpaceStyle } from "./styles";

import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import DoneIcon from "@mui/icons-material/Done";
import { MiniDrawer } from "../components";

const Home = () => {
  return (
    <Box sx={SpaceStyle}>
      <MiniDrawer />
      
        <Typography>Home do Aplicativo</Typography>
      
    </Box>
  );
};

export default Home;
