import type { DefaultFields } from "@/assets/types";
import { api } from "../axios";

const getInvitations = async () => {
  const res = await api.get(`invitations`);
  return res.data;
};

const createInvitation = async (data) => {
  const res = await api.post("invitations", data);
  return res;
};

const updateInvitation = async (id: DefaultFields["id"], data) => {
  const res = await api.put(`invitations/${id}`, data);
  return res.data;
};

const destroyInvitation = async (id: DefaultFields["id"]) => {
  const res = await api.delete(`invitations/${id}`);
  return res;
};

export {
  getInvitations,
  createInvitation,
  updateInvitation,
  destroyInvitation,
};
