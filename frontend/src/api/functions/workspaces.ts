import type { DefaultFields, SearcherType } from "@/assets/types";
import { api } from "../axios";

const getWorkspaces = async (searcher: SearcherType) => {
  const res = await api.get(
    `workspaces?page=${searcher?.pagination?.current_page}&search=${searcher?.search}&status=${searcher?.status}&type=${searcher?.type}`,
  );
  searcher?.setPagination((prev) => ({
    ...prev,
    last_page: res?.data?.last_page,
    to: res?.data?.to,
    total: res?.data?.total,
  }));
  return res?.data?.data;
};

const getWorkspace = async (id: DefaultFields["id"], dataType: string) => {
  const res = await api.get(`workspaces/${id}?dataType=${dataType}`);
  return res.data;
};

const updateMember = async (
  id: DefaultFields["id"],
  data: { role: string },
) => {
  const res = await api.put(`memberships/${id}`, data);
  return res.data;
};

const destroyMember = async (id: DefaultFields["id"]) => {
  const res = await api.delete(`memberships/${id}`);
  return res.data;
};

export { getWorkspaces, getWorkspace, updateMember, destroyMember };
