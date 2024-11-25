import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Box, Typography, Grid } from "@mui/material";
import axios from "axios";

import { MiniDrawer } from "../shared/components";
import { SpaceStyle } from "../shared/styles";
import { getToken } from "../shared/services/payload";
import PieMostProduct from "./pieTeste";
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
        <Grid container spacing={2}>
          {/* Texto principal */}
          <Grid item xs={12}>
            {nome && (
              <Typography variant="h4" color="primary">
                Bem-vindo, {nome}!
              </Typography>
            )}
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
                  <UnarchiveIcon
                    sx={{ ml: 4, fontSize: 40 }}
                    onClick={() => finalizarConta(1, true)} // Passando o ID e o tipo de conta
                  />
                </Box>
              </Box>
            </Grid>

            <Grid item xs={3.2}>
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
                <Typography variant="h4" color="#20c404" sx={{ ml: 2 }}>
                  {resumo.qtdContasReceber}
                </Typography>
                <Box sx={{ display: "flex", flexDirection: "column", ml: 2 }}>
                  <Typography variant="h6">Contas a Receber</Typography>
                  <Typography variant="body1" color="#20c404">
                    Total R$ {resumo.totalReceber.toFixed(2)}
                  </Typography>
                </Box>
                <Box sx={{ color: "#20c404" }}>
                  <ArchiveIcon
                    sx={{ ml: 4, fontSize: 40 }}
                    onClick={() => finalizarConta(2, false)} // Passando o ID e o tipo de conta
                  />
                </Box>
              </Box>
            </Grid>
          </Grid>

          {/* Gráficos */}
          <Grid container item xs={12} spacing={2}>
            <Grid item xs={4}>
              {/* Gráfico 1 */}
              <Box>
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
                  }}
                >
                  <Box sx={{ mr: 10 }}>
                    <Typography variant="h5" color="primary">
                      {" "}
                      Produtos mais vendidos{" "}
                    </Typography>
                  </Box>
                  <PieMostProduct />
                </Box>
              </Box>
            </Grid>
            <Grid item xs={4}>
              {/* Gráfico 1 */}
              <Box>
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
                  }}
                >
                  <Box sx={{ mr: 10 }}>
                    <Typography variant="h5" color="primary">
                      {" "}
                      Produtos mais vendidos{" "}
                    </Typography>
                  </Box>
                  <PieMostProduct />
                </Box>
              </Box>
            </Grid>
          </Grid>
          <Grid container item xs={12} spacing={2}>
          <Grid item xs={4}>
              {/* Gráfico 1 */}
              <Box>
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
                  }}
                >
                  <Box sx={{ mr: 10 }}>
                    <Typography variant="h5" color="primary">
                      {" "}
                      Produtos mais vendidos{" "}
                    </Typography>
                  </Box>
                  <PieMostProduct />
                </Box>
              </Box>
            </Grid>
            <Grid item xs={4}>
              {/* Gráfico 1 */}
              <Box>
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
                  }}
                >
                  <Box sx={{ mr: 10 }}>
                    <Typography variant="h5" color="primary">
                      {" "}
                      Produtos mais vendidos{" "}
                    </Typography>
                  </Box>
                  <PieMostProduct />
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Grid>
      </MiniDrawer>
    </Box>
  );
};

export default Dashboard;
