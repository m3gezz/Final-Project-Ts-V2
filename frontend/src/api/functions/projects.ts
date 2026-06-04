import type { DefaultFields, SearcherType } from "@/assets/types";
import { api } from "../axios";
import { toast } from "sonner";
import type { updateCommentSchemaType } from "@/zod/comments";

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
  toast.success(res?.data?.message);
  return res?.data;
};

const canEdit = async (id: DefaultFields["id"]) => {
  const res = await api.get(`can-edit/${id}`);
  return res.data;
};

const updateProject = async (id: DefaultFields["id"], data: any) => {
  const res = await api.post(`projects/${id}`, data);
  toast.success(res?.data?.message);
  return res?.data;
};

const destroyProject = async (id: DefaultFields["id"]) => {
  const res = await api.delete(`projects/${id}`);
  toast.success(res?.data?.message);
  return res;
};

const createProjectLike = async (id: DefaultFields["id"]) => {
  const res = await api.post("likes", { project_id: id });
  return res;
};

const getProjectComments = async (id: DefaultFields["id"]) => {
  const res = await api.get(`comments?project_id=${id}`);
  return res.data;
};

const createComment = async (data: {
  project_id: DefaultFields["id"];
  content: string;
}) => {
  const res = await api.post("comments", data);
  toast.success(res?.data?.message);
  return res;
};

const updateComment = async (
  id: DefaultFields["id"],
  data: updateCommentSchemaType,
) => {
  const res = await api.put(`comments/${id}`, data);
  toast.success(res?.data?.message);
  return res;
};

const destroyComment = async (id: DefaultFields["id"]) => {
  const res = await api.delete(`comments/${id}`);
  toast.success(res?.data?.message);
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
  getProjectComments,
  createComment,
  updateComment,
  destroyComment,
};
