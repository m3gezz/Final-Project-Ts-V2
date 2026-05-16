import { api } from "../axios";

const getMessages = async (id) => {
  const res = await api.get(`messages?workspace_id=${id}`);
  return res?.data;
};

const createMessage = async (data) => {
  const res = await api.post(`messages`, data);
  return res;
};

const deleteMessage = async (id) => {
  const res = await api.delete(`messages/${id}`);
  return res;
};

export { getMessages, createMessage, deleteMessage };
