import axios from "axios";
import { insumoSchemaType } from "./types";

const BASE_URL = "http://localhost:3000/insumo";

export const getSupplies = async () => {
  const response = await axios.get(BASE_URL);
  return response.data.insumosAtivos;
};

export const getDeactives = async () => {
  const response = await axios.get(BASE_URL);
  return response.data.insumosDesativos;
}

export const postSupplie = async (data: insumoSchemaType) => {
  const { id, ...mydata } = data;
  const response = await axios.post(BASE_URL, mydata);
  return response;
};

export const putSupplie = async (data: insumoSchemaType) => {
  const response = await axios.put(`${BASE_URL}?id=${data.id}`, data);
  return response;
};

export const deleteSupplie = async (id: number) => {
  const response = await axios.delete(`${BASE_URL}?id=${id}`);
  return response;
};
