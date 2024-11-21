import axios from "axios";
import { clienteSchemaType } from "./types";

const BASE_URL = "http://localhost:3000/cliente";

export const getClients = async () => {
  const response = await axios.get(BASE_URL);
  return response.data.clientes;
};

export const postClients = async (data: clienteSchemaType) => {
  const { id, ...mydata } = data;
  const response = await axios.post(BASE_URL, mydata);
  return response;
};

export const putClients = async (data: clienteSchemaType) => {
  const response = await axios.put(`${BASE_URL}?id=${data.id}`, data);
  return response;
};

export const deleteClients = async (id: number) => {
  const response = await axios.delete(`${BASE_URL}?id=${id}`);
  return response;
};