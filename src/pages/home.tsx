import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Box, Button, Typography } from "@mui/material";
import { MiniDrawer } from "../shared/components";
import { SpaceStyle } from "../shared/styles";
import { getToken } from "../shared/services/payload"; // Importa a função do serviço

const Home = () => {
  const navigate = useNavigate();
  const [userId, setUserId] = useState<number | null>(null); // Estado para armazenar o userId
  const [nome, setNome] = useState<string | null>(null); // Estado para armazenar o userId
  const [isAdm, setIsAdm] = useState<boolean | null>(null); // Estado para armazenar o userId

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  useEffect(() => {
    const fetchToken = async () => {
      const tokenData = await getToken();
      if (tokenData) {
        setUserId(tokenData.userId);
        setNome(tokenData.nome);
        setIsAdm(tokenData.isAdm);
      }
    };

    fetchToken();
  }, []);

  return (
    <Box sx={SpaceStyle}>
      <MiniDrawer />
      <Typography>Home do Aplicativo</Typography>
      {userId && <Typography>ID do Usuário: {userId}</Typography>}
      {nome && <Typography>Nome do Usuário: {nome}</Typography>}
      {isAdm && <Typography>Role do Usuário: {isAdm}</Typography>}
      <Button onClick={handleLogout} variant="contained" color="primary">
        Log Out
      </Button>
    </Box>
  );
};

export default Home;
