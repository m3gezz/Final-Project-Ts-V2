import type { DefaultFields } from "@/assets/types";
import { api } from "../axios";
import { toast } from "sonner";

const getRequests = async () => {
  const res = await api.get(`requests`);
  return res.data;
};

const createRequest = async (data: { project_id: DefaultFields["id"] }) => {
  const res = await api.post("requests", data);
  toast.success(res?.data?.message);
  return res;
};

const updateRequest = async (
  id: DefaultFields["id"],
  data: { status: "accepted" | "declined" },
) => {
  const res = await api.put(`requests/${id}`, data);
  toast.success(res?.data?.message);
  return res.data;
};

const destroyRequest = async (id: DefaultFields["id"]) => {
  const res = await api.delete(`requests/${id}`);
  toast.success(res?.data?.message);
  return res;
};

export { getRequests, createRequest, updateRequest, destroyRequest };
