import axios from "axios";
import { produtoSchemaType } from "./types";

const BASE_URL = "http://localhost:3000/produto";

export const getProducts = async () => {
  const response = await axios.get(BASE_URL);
  return response.data.produtosAtivos;
};

export const getProductsDeactivate = async () => {
  const response = await axios.get(BASE_URL);
  return response.data.produtosDesativos;
};

export const postProducts = async (data: produtoSchemaType) => {
  const { id, ...mydata } = data;
  const response = await axios.post(BASE_URL, mydata);
  return response;
};

export const putProducts = async (data: produtoSchemaType) => {
  const response = await axios.put(`${BASE_URL}?id=${data.id}`, data);
  return response;
};

export const deleteProducts = async (id: number) => {
  const response = await axios.delete(`${BASE_URL}?id=${id}`);
  return response;
};