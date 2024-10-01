import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Box, Button, Typography } from "@mui/material";
import { MiniDrawer } from "../components";
import { SpaceStyle } from "./styles";
import { getToken } from '../services/payload'; // Importa a função do serviço

const Home = () => {
  const navigate = useNavigate();
  const [userId, setUserId] = useState<number | null>(null); // Estado para armazenar o userId

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate("/login");
  };

  useEffect(() => {
    // Chama o serviço e atualiza o estado com o userId
    const fetchToken = async () => {
      const tokenData = await getToken(); // Agora retorna o userId
      if (tokenData) {
        setUserId(tokenData.userId);
      }
    };

    fetchToken();
  }, []);

  return (
    <Box sx={SpaceStyle}>
      <MiniDrawer />
      <Typography>Home do Aplicativo</Typography>
      {userId && <Typography>ID do Usuário: {userId}</Typography>} {/* Exibe o userId */}
      <Button onClick={handleLogout} variant="contained" color="primary">
        Log Out
      </Button>
    </Box>
  );
};

export default Home;
