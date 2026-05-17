import type { DefaultFields } from "@/assets/types";
import { api } from "../axios";

const createTask = async (data) => {
  const res = await api.post("tasks", data);
  return res;
};

const updateTask = async (id: DefaultFields["id"], data) => {
  const res = await api.put(`tasks/${id}`, data);
  return res;
};

const destroyTask = async (id: DefaultFields["id"]) => {
  const res = await api.delete(`tasks/${id}`);
  return res;
};

export { createTask, updateTask, destroyTask };
