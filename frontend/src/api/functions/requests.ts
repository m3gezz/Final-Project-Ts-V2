import type { DefaultFields } from "@/assets/types";
import { api } from "../axios";

const getRequests = async () => {
  const res = await api.get(`requests`);
  return res.data;
};

const createRequest = async (data) => {
  const res = await api.post("requests", data);
  return res;
};

const updateRequest = async (id: DefaultFields["id"], data) => {
  const res = await api.put(`requests/${id}`, data);
  return res.data;
};

const destroyRequest = async (id: DefaultFields["id"]) => {
  const res = await api.delete(`requests/${id}`);
  return res;
};

export { getRequests, createRequest, updateRequest, destroyRequest };
