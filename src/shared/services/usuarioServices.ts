import axios from "axios";
import { usuarioSchemaType } from "./types";

const BASE_URL = "http://localhost:3000/usuario";

export const getUsers = async () => {
  const response = await axios.get(BASE_URL);
  return response.data.usuariosAtivos;
};

export const getUsersAll = async () => {
  const response = await axios.get(BASE_URL);
  return response.data.allData;
};

export const getDeactiveUsers = async () => {
  const response = await axios.get(BASE_URL);
  return response.data.usuariosDesativos;
};


export const postUser = async (data: usuarioSchemaType) => {
  const { id, ...mydata } = data;
  const response = await axios.post(BASE_URL, mydata);
  return response;
};

export const putUser = async (data: usuarioSchemaType) => {
  const response = await axios.put(`${BASE_URL}?id=${data.id}`, data);
  return response;
};

export const deleteUser = async (id: number) => {
  const response = await axios.delete(`${BASE_URL}?id=${id}`);
  return response;
};
