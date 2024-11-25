import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Box, Typography, Grid } from "@mui/material";
import axios from "axios";

import { MiniDrawer } from "../shared/components";
import { SpaceStyle } from "../shared/styles";
import { getToken } from "../shared/services/payload";
import PieMostProduct from "./pieTeste";
import { flexbox } from "@mui/system";
import UnarchiveIcon from "@mui/icons-material/Unarchive";
import ArchiveIcon from "@mui/icons-material/Archive";
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
        const response = await axios.get(
          "http://localhost:3000/financeiro/resumo"
        );
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
            <Grid item xs={3}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  bgcolor: "#fff",
                  padding: 2,
                  borderRadius: 2,
                  boxShadow: 2,
                }}
              >
                <Typography variant="h4" color="error" sx={{ ml: 2 }}>
                  {resumo.qtdContasPagar}
                </Typography>
                <Box sx={{ display: "flex", flexDirection: "column", ml: 2 }}>
                  <Typography variant="h6">Contas a Pagar</Typography>
                  <Typography variant="body1" color="error">
                    Total R$ {resumo.totalPagar.toFixed(2)}
                  </Typography>
                </Box>
                <Box sx={{ color: "#f00" }}>
                  <UnarchiveIcon sx={{ ml: 4, fontSize: 40 }} />
                </Box>
              </Box>
            </Grid>

            <Grid item xs={3}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  bgcolor: "#fff",
                  padding: 2,
                  borderRadius: 2,
                  boxShadow: 2,
                }}
              >
                <Typography variant="h4" color="error" sx={{ ml: 2 }}>
                  {resumo.qtdContasReceber}
                </Typography>
                <Box sx={{ display: "flex", flexDirection: "column", ml: 2 }}>
                  <Typography variant="h6">Contas a Receber</Typography>
                  <Typography variant="body1" color="error">
                    Total R$ {resumo.totalReceber.toFixed(2)}
                  </Typography>
                </Box>
                <Box sx={{ color: "#0f0" }}>
                  <UnarchiveIcon sx={{ ml: 4, fontSize: 40 }} />
                </Box>
              </Box>
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
