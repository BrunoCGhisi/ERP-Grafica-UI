import axios from "axios";
import { proCategorySchemaType } from "./types";

const BASE_URL = "http://localhost:3000/categoria_produto";

export const getCategories = async () => {
  const response = await axios.get(BASE_URL);
  return response.data.catProdAtivos;
};

export const getDeactiveCategories = async () => {
  const response = await axios.get(BASE_URL);
  return response.data.catProdDesativos;
};

export const postCategories = async (data: proCategorySchemaType) => {
  const { id, ...mydata } = data;
  const response = await axios.post(BASE_URL, mydata);
  return response;
};

export const putCategories = async (data: proCategorySchemaType) => {
  const response = await axios.put(`${BASE_URL}?id=${data.id}`, data);
  return response;
};

export const deleteCategories = async (id: number) => {
  const response = await axios.delete(`${BASE_URL}?id=${id}`);
  return response;
};
