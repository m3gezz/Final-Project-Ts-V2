import { api } from "../axios";

const requestJoin = async (data) => {
  const res = await api.post("requests", data);
  return res;
};

const inviteUser = async (data) => {
  const res = await api.post("invitations", data);
  return res;
};

const getRequests = async () => {
  const res = await api.get(`requests`);
  return res.data;
};

const getInvitations = async () => {
  const res = await api.get(`invitations`);
  return res.data;
};

const modifyRequest = async (id, data) => {
  const res = await api.put(`requests/${id}`, data);
  return res.data;
};

const modifyInvitation = async (id, data) => {
  const res = await api.put(`invitations/${id}`, data);
  return res.data;
};

const cancelRequest = async (request_id) => {
  const res = await api.delete(`requests/${request_id}`);
  return res;
};

const cancelInvitation = async (invitation_id) => {
  const res = await api.delete(`invitations/${invitation_id}`);
  return res;
};

export {
  requestJoin,
  getRequests,
  cancelRequest,
  modifyRequest,
  inviteUser,
  cancelInvitation,
  getInvitations,
  modifyInvitation,
};
