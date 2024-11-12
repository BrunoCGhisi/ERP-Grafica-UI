import axios from "axios";
import { bancoSchemaType } from "./types";

const BASE_URL = "http://localhost:3000/banco";

export const getBanks = async () => {
  const response = await axios.get(BASE_URL);
  return response.data.bancos;
};

export const postBank = async (data: bancoSchemaType) => {
  const { id, ...mydata } = data;
  const response = await axios.post(BASE_URL, mydata);
  return response;
};

export const putBank = async (data: bancoSchemaType) => {
  const response = await axios.put(`${BASE_URL}?id=${data.id}`, data);
  return response;
};

export const deleteBank = async (id: number) => {
  const response = await axios.delete(`${BASE_URL}?id=${id}`);
  return response;
};
