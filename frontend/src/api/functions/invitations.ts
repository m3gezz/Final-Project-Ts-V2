import type { DefaultFields } from "@/assets/types";
import { api } from "../axios";
import { toast } from "sonner";

const getInvitations = async () => {
  const res = await api.get(`invitations`);
  return res.data;
};

const createInvitation = async (data: {
  workspace_id: DefaultFields["id"];
  user_id: DefaultFields["id"];
}) => {
  const res = await api.post("invitations", data);
  toast.success(res?.data?.message);
  return res;
};

const updateInvitation = async (
  id: DefaultFields["id"],
  data: { status: "accepted" | "declined" },
) => {
  const res = await api.put(`invitations/${id}`, data);
  toast.success(res?.data?.message);
  return res.data;
};

const destroyInvitation = async (id: DefaultFields["id"]) => {
  const res = await api.delete(`invitations/${id}`);
  toast.success(res?.data?.message);
  return res;
};

export {
  getInvitations,
  createInvitation,
  updateInvitation,
  destroyInvitation,
};
