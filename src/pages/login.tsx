import React, { useState, useEffect } from "react";
import { UserVO } from "../services/types";
import axios from "axios";
import {
  Box,
  Modal,
  Button,
  Typography,
  TextField,
  Stack,
  IconButton
} from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { ModalStyle } from "./styles";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import DoneIcon from "@mui/icons-material/Done";


const Login = () => {

  const [users, setUsers] = useState<UserVO[]>([]);
  
  
  return ( 
    <Box>
      <Box> 
        <Typography> 
          Bem vindo ao login
        </Typography>
      </Box>
      <Box>
        <Typography> 
          Logar
        </Typography>
        

      </Box>
    </Box>
  )
}

export default Login;