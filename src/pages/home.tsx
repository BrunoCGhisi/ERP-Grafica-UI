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