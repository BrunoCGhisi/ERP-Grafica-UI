import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Box, Button, Typography, Grid } from "@mui/material";

import { MiniDrawer } from "../shared/components";
import { SpaceStyle } from "../shared/styles";
import { getToken } from "../shared/services/payload";

const Dashboard = () => {
  const navigate = useNavigate();
  const [userId, setUserId] = useState<number | null>(null);
  const [nome, setNome] = useState<string | null>(null);
  const [isAdm, setIsAdm] = useState<boolean | null>(null);

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
  <MiniDrawer>
    <Grid container spacing={2}>
      {/* Texto principal */}
      <Grid item xs={12}>
      {nome && <Typography>Olá {nome}</Typography>}
      </Grid>

      {/* A pagar e A receber */}
      <Grid container item xs={12} spacing={2}>
        <Grid item xs={6}>
          <Typography>A pagar</Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography>A receber</Typography>
        </Grid>
      </Grid>

      {/* Gráficos */}
      <Grid container item xs={12} spacing={2}>
        <Grid item xs={6}>
          <Typography>Gráfico 1</Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography>Gráfico 2</Typography>
        </Grid>
      </Grid>
      <Grid container item xs={12} spacing={2}>
        <Grid item xs={6}>
          <Typography>Gráfico 3</Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography>Gráfico 4</Typography>
        </Grid>
      </Grid>
    </Grid>
  </MiniDrawer>
</Box>
  );
};

export default Dashboard;
