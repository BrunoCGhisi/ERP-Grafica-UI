import React, { useEffect, useState } from "react";
import axios from "axios";
import { BarChart } from "@mui/x-charts/BarChart";
import { z } from "zod";
import { SalesOfMonthSchemaType, salesOfMonthSchema } from "../shared/services/types";

const SalesChart: React.FC = () => {
  const [salesData, setSalesData] = useState<SalesOfMonthSchemaType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSalesData = async () => {
    try {
      const response = await axios.get("http://localhost:3000/vendas/mensais");
      const parsedData = response.data.map((item: unknown) => salesOfMonthSchema.parse(item)); // Valida os dados recebidos
      setSalesData(parsedData);
    } catch (err) {
      setError("Erro ao carregar dados do gráfico.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSalesData();

    const interval = setInterval(() => {
      fetchSalesData();
    }, 10000); // A cada 10 segundos

    return () => clearInterval(interval); // Limpa intervalo ao desmontar
  }, []);

  if (loading) return <p>Carregando...</p>;
  if (error) return <p>{error}</p>;

  const labels = salesData.map((sale) => sale.dataVenda);
  const faturamento = salesData.map((sale) => sale.faturamento);

  return (
    <div style={{ width: "100%", maxWidth: 700, margin: "0 auto" }}>
      <BarChart
        xAxis={[{ scaleType: "band", data: labels }]}
        series={[{ data: faturamento }]}
        width={600}
        height={400}
      />
    </div>
  );
};

export default SalesChart;
