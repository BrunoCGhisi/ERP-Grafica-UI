import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { BarChart } from "@mui/x-charts/BarChart";
import { axisClasses } from "@mui/x-charts/ChartsAxis";
import { SalesOfMonthSchemaType } from "../shared/services/types";

// Função para formatar valores em R$
const valueFormatter = (value: number | null) => {
  return value !== null
    ? `R$ ${value.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`
    : "";
};

const SalesChart: React.FC = () => {
  const [salesData, setSalesData] = useState<SalesOfMonthSchemaType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const [chartSize, setChartSize] = useState({ width: 0, height: 0 });

  const fetchSalesData = async () => {
    try {
      const response = await axios.get<SalesOfMonthSchemaType[]>(
        "http://localhost:3000/vendas/mensais"
      );
      setSalesData(response.data);
      setLoading(false);
    } catch (err) {
      setError("Erro ao carregar dados do gráfico.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSalesData();

    const interval = setInterval(() => {
      fetchSalesData();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const resizeObserver = new ResizeObserver(() => {
      if (chartContainerRef.current) {
        const { width, height } =
          chartContainerRef.current.getBoundingClientRect();
        setChartSize({
          width: width,
          height: height * 0.9, // Garante altura proporcional ao container
        });
      }
    });

    if (chartContainerRef.current) {
      resizeObserver.observe(chartContainerRef.current);
    }

    return () => resizeObserver.disconnect();
  }, []);

  if (loading) return <p>Carregando...</p>;
  if (error) return <p>{error}</p>;

  const labels = salesData.map((sale) => sale.dataVenda);
  const faturamento = salesData.map((sale) => sale.faturamento);

  return (
    <div ref={chartContainerRef} style={{ width: "100%", height: "100%" }}>
      <BarChart
        dataset={salesData.map((sale) => ({
          month: sale.dataVenda,
          faturamento: sale.faturamento,
        }))}
        xAxis={[
          {
            scaleType: "band",
            dataKey: "month",
          },
        ]}
        yAxis={[
          {
            label: "Faturamento Bruto (R$)",
          },
        ]}
        series={[
          {
            dataKey: "faturamento",
            label: "Faturamento Bruto",
            valueFormatter,
            color: "#ffb74d",
          },
        ]}
        layout="vertical"
        grid={{
          vertical: true,
          horizontal: true,
        }}
        width={500}
        height={300}
        sx={{
          [`.${axisClasses.left} .${axisClasses.label}`]: {
            transform: "translate(-30px, 0)",
          },
        }}
      />
    </div>
  );
};

export default SalesChart;
