import { unsetAuth } from "@/redux/authSlice";
import { api } from "../axios";

const getUser = async (id: string | undefined) => {
  const res = await api.get(`users/${id}`);
  return res?.data?.profile;
};

const updatePassword = async (id, data) => {
  const res = await api.patch(`users/${id}`, data);
  return res;
};

const deleteAccount = async (id, data, disp) => {
  const res = await api.delete(`users/${id}`, {
    data: data,
  });
  disp(unsetAuth());
  return res;
};

const updateUser = async (id, data) => {
  const res = await api.post(`users/${id}`, data);
  return res;
};

const getUsers = async (searcher) => {
  const res = await api.get(
    `users?page=${searcher?.pagination?.current_page}&search=${searcher?.search}&skill_id=${searcher?.skill_id}&sort=${searcher?.sort}`,
  );
  searcher?.setPagination((prev) => ({
    ...prev,
    last_page: res?.data?.last_page,
    to: res?.data?.to,
    total: res?.data?.total,
  }));
  return res?.data?.data;
};

export { getUser, updatePassword, deleteAccount, updateUser, getUsers };
