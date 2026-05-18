import type { DefaultFields, SearcherType } from "@/assets/types";
import { api } from "../axios";

const getProjects = async (searcher: SearcherType) => {
  const res = await api.get(
    `projects?page=${searcher?.pagination?.current_page}&search=${searcher?.search}&category_id=${searcher?.category_id ?? ""}&sort=${searcher?.sort ?? ""}`,
  );
  searcher?.setPagination((prev) => ({
    ...prev,
    last_page: res?.data?.last_page,
    to: res?.data?.to,
    total: res?.data?.total,
  }));
  return res?.data?.data;
};

const getProject = async (id: DefaultFields["id"]) => {
  const res = await api.get(`projects/${id}`);
  return res?.data;
};

const createProject = async (data: any) => {
  const res = await api.post("projects", data);
  return res;
};

const canEdit = async (id: DefaultFields["id"]) => {
  const res = await api.get(`can-edit/${id}`);
  return res.data;
};

const updateProject = async (id: DefaultFields["id"], data: any) => {
  const res = await api.post(`projects/${id}`, data);
  return res;
};

const destroyProject = async (id: DefaultFields["id"]) => {
  const res = await api.delete(`projects/${id}`);
  return res;
};

const createProjectLike = async (id: DefaultFields["id"]) => {
  const res = await api.post("likes", { project_id: id });
  return res;
};

export {
  getProjects,
  getProject,
  createProject,
  canEdit,
  updateProject,
  destroyProject,
  createProjectLike,
};
