import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Box, Typography, Grid } from "@mui/material";
import axios from "axios";

import { MiniDrawer } from "../shared/components";
import { SpaceStyle } from "../shared/styles";
import { getToken } from "../shared/services/payload";
import PieMostProduct from "./pieTeste";
import ColumnSalesChart from "./chartFaturamentoMensal";
import UnarchiveIcon from "@mui/icons-material/Unarchive";
import ArchiveIcon from "@mui/icons-material/Archive";
import SellIcon from "@mui/icons-material/Sell";
import LocalMallIcon from "@mui/icons-material/LocalMall";
import SalesChart from "./chartFaturamentoMensal";

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
    comprasHoje: 0,
    vendasHoje: 0,
  });

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
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
    fetchResumo(); // Chama a função para buscar os dados iniciais do resumo
  }, []);

  // Função para finalizar uma conta paga ou recebida
  const finalizarConta = async (idConta: number, isPagar: boolean) => {
    try {
      await axios.put(`http://localhost:3000/financeiro/${idConta}`, {
        isPagarReceber: !isPagar,
      });
      fetchResumo(); // Atualiza o resumo após finalizar a conta
    } catch (error) {
      console.error("Erro ao finalizar a conta:", error);
    }
  };

  return (
    <Box sx={SpaceStyle}>
      <MiniDrawer>
        <Grid container spacing={2} sx={{ paddingX: 2 }}>
          {/* Texto principal */}
          <Grid item xs={12} sx={{ mb: 2 }}>
            {nome && (
              <Typography variant="h4" color="primary" sx={{ ml: 2 }}>
                Olá, {nome}!
              </Typography>
            )}
          </Grid>

          {/* Valores A pagar e A receber */}
          <Grid container item xs={12} spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  bgcolor: "#fff",
                  padding: 2,
                  borderRadius: 2,
                  boxShadow: 2,
                }}
              >
                <Typography variant="h4" color="error" sx={{ ml: 2 }}>
                  {resumo.qtdContasPagar}
                </Typography>
                <Box sx={{ ml: 2, flex: 1 }}>
                  <Typography variant="h6" color="text.primary">
                    Contas a Pagar
                  </Typography>
                  <Typography variant="body1" color="error">
                    Total R$ {resumo.totalPagar.toFixed(2)}
                  </Typography>
                </Box>
                <UnarchiveIcon sx={{ fontSize: 40, color: "error.main" }} />
              </Box>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  bgcolor: "#fff",
                  padding: 2,
                  borderRadius: 2,
                  boxShadow: 2,
                }}
              >
                <Typography variant="h4" color="success" sx={{ ml: 1 }}>
                  {resumo.qtdContasReceber}
                </Typography>
                <Box sx={{ ml: 2, flex: 1 }}>
                  <Typography variant="h6" color="text.primary">
                    Contas a Receber
                  </Typography>
                  <Typography variant="body1" color="success.main">
                    Total R$ {resumo.totalReceber.toFixed(2)}
                  </Typography>
                </Box>
                <ArchiveIcon sx={{ fontSize: 40, color: "success.main" }} />
              </Box>
            </Grid>

            <Grid item xs={12} sm={6} md={2.8}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  bgcolor: "#fff",
                  padding: 2,
                  borderRadius: 2,
                  boxShadow: 2,
                }}
              >
                <Typography variant="h4" color="primary" sx={{ ml: 2 }}>
                  {resumo.comprasHoje}
                </Typography>
                <Box sx={{ ml: 2, flex: 1 }}>
                  <Typography variant="h6" color="text.primary">
                    Compras
                  </Typography>
                  <Typography variant="body1" color="primary">
                    Registradas hoje
                  </Typography>
                </Box>
                <LocalMallIcon sx={{ fontSize: 40, color: "primary.main" }} />
              </Box>
            </Grid>

            <Grid item xs={12} sm={6} md={2.8}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  bgcolor: "#fff",
                  padding: 2,
                  borderRadius: 2,
                  boxShadow: 2,
                }}
              >
                <Typography variant="h4" color="primary" sx={{ ml: 2 }}>
                  {resumo.vendasHoje}
                </Typography>
                <Box sx={{ ml: 2, flex: 1 }}>
                  <Typography variant="h6" color="text.primary">
                    Vendas
                  </Typography>
                  <Typography variant="body1" color="primary">
                    Registradas hoje
                  </Typography>
                </Box>
                <SellIcon sx={{ fontSize: 40, color: "primary.main" }} />
              </Box>
            </Grid>
          </Grid>

          {/* Gráficos */}
          <Grid container item xs={12} spacing={2}>
            <Grid item xs={12} sm={5.5}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  flexDirection: "column",
                  bgcolor: "#fff",
                  padding: 2,
                  borderRadius: 2,
                  boxShadow: 2,
                  width: "100%",
                }}
              >
                <Typography variant="h5" color="primary" sx={{ mb: 2 }}>
                  Produtos mais vendidos
                </Typography>
                <PieMostProduct />
              </Box>
            </Grid>

            <Grid item xs={12} sm={5.5}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  bgcolor: "#fff",
                  padding: 2,
                  borderRadius: 2,
                  boxShadow: 2,
                  width: "100%", // Garante que o Box ocupe o espaço total disponível
                  
                }}
              >
                <Typography variant="h5" color="primary" sx={{ mb: 2 }}>
                  Faturamento Mensal
                </Typography>
                <SalesChart />
              </Box>
            </Grid>
          </Grid>
        </Grid>
      </MiniDrawer>
    </Box>
  );
};

export default Dashboard;
