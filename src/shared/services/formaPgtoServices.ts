import axios from "axios";
import { formaPgtoSchemaType } from "./types";

const BASE_URL = "http://localhost:3000/forma_pgto";

export const getPaymentWays = async () => {
  const response = await axios.get(BASE_URL);
  return response.data.formas_pgto;
};

export const postPaymentWays = async (data: formaPgtoSchemaType) => {
  const { id, ...mydata } = data;
  const response = await axios.post(BASE_URL, mydata);
  return response;
};

export const putPaymentWays = async (data: formaPgtoSchemaType) => {
  const response = await axios.put(`${BASE_URL}?id=${data.id}`, data);
  return response;
};

export const deletePaymentWays = async (id: number) => {
  const response = await axios.delete(`${BASE_URL}?id=${id}`);
  return response;
};