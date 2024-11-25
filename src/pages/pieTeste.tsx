import { useState, useEffect } from "react";
import axios from "axios";
import { Box } from "@mui/material";
import { PieChart } from "@mui/x-charts/PieChart";
import { pieMostProductSchemaType } from "../shared/services/types";

const PieMostProduct = () => {
  const [pieMostProduct, setPieMostProduct] = useState<pieMostProductSchemaType[]>([]);

  useEffect(() => {
    const getPieMostProduct = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/produto/PieVendidos"
        );
        setPieMostProduct(response.data);
      } catch (error) {
        console.error("Erro ao buscar produtos mais vendidos:", error);
      }
    };
    getPieMostProduct();
  }, []);

  // Adicionando cores personalizadas
  const pieData = pieMostProduct.map((produto, index) => ({
    id: produto.idProduto,
    value: produto.totalVendido,
    label: produto.nome,
    color: [
      "#f57c00", // Cor 1
      "#ff9800", // Cor 2
      "#ffa726", // Cor 3 
      "#ffcc80", // Cor 4
      "#ffe0b2", // Cor 5
    ][index % 5], // Alterna entre as cores
  }));

  return (
    <Box>
      <PieChart
        series={[
          {
            data: pieData,
            innerRadius: 40,
            outerRadius: 100,
            highlightScope: { fade: "global", highlight: "item" },
            faded: { innerRadius: 30, additionalRadius: -10, color: "gray" },
            highlighted: { additionalRadius: 10 },
          },
        ]}
        width={400}
        height={300}
      />
    </Box>
  );
};

export default PieMostProduct;
