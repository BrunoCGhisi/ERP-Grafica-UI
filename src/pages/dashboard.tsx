import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Box, Typography, Grid } from "@mui/material";

import { MiniDrawer } from "../shared/components";
import { SpaceStyle } from "../shared/styles";
import { getToken } from "../shared/services/payload";
import { getTotaisFinanceiros } from "../shared/services";

const Dashboard = () => {
  const navigate = useNavigate();
  const [nome, setNome] = useState<string | null>(null);
  const [totalPagar, setTotalPagar] = useState<number>(0);
  const [totalReceber, setTotalReceber] = useState<number>(0);

  useEffect(() => {
    const fetchToken = async () => {
      const tokenData = await getToken();
      if (tokenData) {
        setNome(tokenData.nome);
      }
    };

    const fetchTotais = async () => {
      const totais = await getTotaisFinanceiros();
      if (totais) {
        setTotalPagar(totais.total_a_pagar);
        setTotalReceber(totais.total_a_receber);
      }
    };

    fetchToken();
    fetchTotais();
  }, []);

  return (
    <Box sx={SpaceStyle}>
      <MiniDrawer>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            {nome && <Typography>Olá {nome}</Typography>}
          </Grid>
          <Grid container item xs={12} spacing={2}>
            <Grid item xs={6}>
              <Typography>A pagar: R$ {totalPagar.toFixed(2)}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography>A receber: R$ {totalReceber.toFixed(2)}</Typography>
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
