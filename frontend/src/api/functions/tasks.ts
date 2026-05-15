import { api } from "../axios";

const createTask = async (data) => {
  const res = await api.post("tasks", data);
  return res;
};

const modifyTask = async (id, data) => {
  const res = await api.put(`tasks/${id}`, data);
  return res;
};

const deleteTask = async (id) => {
  const res = await api.delete(`tasks/${id}`);
  return res;
};

export { createTask, modifyTask, deleteTask };
