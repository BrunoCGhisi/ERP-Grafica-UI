import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Box, Typography, Grid } from "@mui/material";
import axios from "axios";

import { MiniDrawer } from "../shared/components";
import { SpaceStyle } from "../shared/styles";
import { getToken } from "../shared/services/payload";
import PieMostProduct from "./pieTeste";

const Dashboard = () => {
  const navigate = useNavigate();
  const [userId, setUserId] = useState<number | null>(null);
  const [nome, setNome] = useState<string | null>(null);
  const [isAdm, setIsAdm] = useState<boolean | null>(null);
  const [resumo, setResumo] = useState({
    totalReceber: 0,
    totalPagar: 0,
    qtdContasReceber: 0,
    qtdContasPagar: 0,
  });

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

    const fetchResumo = async () => {
      try {
        const response = await axios.get("http://localhost:3000/financeiro/resumo");
        setResumo(response.data);
      } catch (error) {
        console.error("Erro ao buscar resumo financeiro:", error);
      }
    };

    fetchToken();
    fetchResumo();
  }, []);

  return (
    <Box sx={SpaceStyle}>
      <MiniDrawer>
        <Grid container spacing={2}>
          {/* Texto principal */}
          <Grid item xs={12}>
            {nome && <Typography variant="h5">Bem-vindo, {nome}!</Typography>}
          </Grid>

          {/* Valores A pagar e A receber */}
          <Grid container item xs={12} spacing={2}>
            <Grid item xs={6}>
              <Typography variant="h6">📤 A Pagar</Typography>
              <Typography variant="body1" color="error">
                R$ {resumo.totalPagar.toFixed(2)}
              </Typography>
              <Typography variant="body2">
                Contas: {resumo.qtdContasPagar}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="h6">📥 A Receber</Typography>
              <Typography variant="body1" color="primary">
                R$ {resumo.totalReceber.toFixed(2)}
              </Typography>
              <Typography variant="body2">
                Contas: {resumo.qtdContasReceber}
              </Typography>
            </Grid>
          </Grid>

          {/* Gráficos */}
          <Grid container item xs={12} spacing={2}>
            <Grid item xs={6}>
              {/* Gráfico 1 */}
              <PieMostProduct />
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
