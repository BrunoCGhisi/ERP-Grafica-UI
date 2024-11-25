import axios from "axios";
import { vendaSchemaType } from "./types";

const BASE_URL = "http://localhost:3000/venda";


export const getSales = async () => {
  const response = await axios.get(BASE_URL);
  return response.data.vendas;
};

export const getSalesProd = async () => {
  try {
    const response = await axios.get(BASE_URL);
    return response.data.vendasProdutos;
  } catch (error) {
    console.log("Não foi possível obter Vendas: ", error)
  }
  
};

export const postSale = async (data: vendaSchemaType) => {
  const { id, ...mydata } = data;
  const response = await axios.post(BASE_URL, mydata);
  return response;
};

export const putSale = async (data: vendaSchemaType) => {
  console.log("DA FUNC",data)

  const response = await axios.put(`${BASE_URL}?id=${data.id}`, data);
  return response;
};

export const deleteSale = async (id: number) => {
  const response = await axios.delete(`${BASE_URL}?id=${id}`);
  return response;
};
