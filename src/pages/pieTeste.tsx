import { useState, useEffect } from "react";
import axios from "axios";
import { pieMostProductSchemaType } from "../shared/services/types";
import { Box } from "@mui/material";
import { PieChart } from "@mui/x-charts/PieChart";

const PieMostProduct = () => {
  const [pieMostProduct, setPieMostProduct] = useState<
    pieMostProductSchemaType[]
  >([]);

  useEffect(() => {
    const getPieMostProduct = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/produto/PieVendidos"
        );
        console.log(response);
        setPieMostProduct(response.data);
      } catch (error) {
        console.error("Erro ao buscar produtos mais vendidos:", error);
      }
    };
    getPieMostProduct();
  }, []);

  const pieData = pieMostProduct.map((produto) => ({
    id: produto.idProduto,
    value: produto.totalVendido,
    label: produto.nome,
    
  }));

  return (
    <Box>
      <PieChart
        series={[
          {
            data: pieData,
            innerRadius: 0, 
            outerRadius: 100, 
          },
        ]}
        width={400}
        height={300}
      />
    </Box>
  );
};

export default PieMostProduct;
