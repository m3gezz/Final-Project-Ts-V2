import { unsetAuth } from "@/redux/authSlice";
import { api } from "../axios";
import type { AppDispatch } from "@/redux/store";
import type { DefaultFields, SearcherType } from "@/assets/types";
import type {
  destroyUserSchemaType,
  updatePasswordSchemaType,
} from "@/zod/usersSchemas";
import { toast } from "sonner";

const getUsers = async (searcher: SearcherType) => {
  const res = await api.get(
    `users?page=${searcher?.pagination?.current_page}&search=${searcher?.search}&skill_id=${searcher?.skill_id ?? ""}&sort=${searcher?.sort ?? ""}`,
  );
  searcher?.setPagination((prev) => ({
    ...prev,
    last_page: res?.data?.last_page,
    to: res?.data?.to,
    total: res?.data?.total,
  }));
  return res?.data?.data;
};

const getUser = async (id: DefaultFields["id"]) => {
  const res = await api.get(`users/${id}`);
  return res?.data;
};

const updateUser = async (id: DefaultFields["id"], data: FormData) => {
  const res = await api.post(`users/${id}`, data);
  toast.success(res?.data?.message);
  return res;
};

const updatePassword = async (
  id: DefaultFields["id"],
  data: updatePasswordSchemaType,
) => {
  const res = await api.patch(`users/${id}`, data);
  toast.success(res?.data?.message);
  return res;
};

const destroyUser = async (
  id: DefaultFields["id"],
  data: destroyUserSchemaType,
  disp: AppDispatch,
) => {
  const res = await api.delete(`users/${id}`, {
    data: data,
  });
  disp(unsetAuth());
  toast.success(res?.data?.message);
  return res;
};

const userDashboard = async () => {
  const res = await api.get(`userDashboard`);
  return res?.data;
};

const adminDashboard = async () => {
  const res = await api.get(`adminDashboard`);
  return res?.data;
};

export {
  getUsers,
  getUser,
  updateUser,
  updatePassword,
  destroyUser,
  userDashboard,
  adminDashboard,
};
