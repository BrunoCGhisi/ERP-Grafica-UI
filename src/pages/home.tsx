import React, { useState, useEffect } from "react";

import { CustomerVO } from "../services/types";

import axios from "axios";

import {
    Accordion,
    AccordionDetails,
    Box,
    Modal,
    AccordionSummary,
    Button,
    Divider,
    IconButton,
    Stack,
    TextField,
    Typography,
  } from "@mui/material";

  //Icones
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import DoneIcon from "@mui/icons-material/Done";


import { useNavigate } from 'react-router-dom';

const Home = () => {

    const navigate = useNavigate()

    const loginAction = () => {
        navigate('/login');
    };

    return (
        <Box>
            <Button onClick={loginAction}>
                Logar
            </Button>
        </Box>
    )
}

export default Home