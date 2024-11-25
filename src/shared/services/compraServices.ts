import axios from "axios";
import { compraSchemaType } from "./types";

const BASE_URL = "http://localhost:3000/compra";

export const getPurchases = async () => {
  const response = await axios.get(BASE_URL);
  return response.data.compras;
};

export const getPurchasesSupplies = async () => {
  const response = await axios.get(BASE_URL);
  return response.data.comprasInsumos;
};

export const postPurchases = async (data: compraSchemaType) => {
  const { id, ...mydata } = data;
  const response = await axios.post(BASE_URL, mydata);
  return response;
};

export const putPurchases = async (data: compraSchemaType) => {
  const response = await axios.put(`${BASE_URL}?id=${data.id}`, data);
  return response;
};

export const deletePurchases = async (id: number) => {
  const response = await axios.delete(`${BASE_URL}?id=${id}`);
  return response;
};