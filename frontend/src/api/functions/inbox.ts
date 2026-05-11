import { api } from "../axios";

const requestJoin = async (data) => {
  const res = await api.post("enter-requests", data);
  return res;
};

const getInbox = async (inbox) => {
  const res = await api.get(`${inbox}`);
  return res.data;
};

const cancelRequest = async (request_id) => {
  const res = await api.delete(`enter-requests/${request_id}`);
  return res;
};

export { requestJoin, getInbox, cancelRequest };
