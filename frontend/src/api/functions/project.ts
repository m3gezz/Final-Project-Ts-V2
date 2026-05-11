import { api } from "../axios";

const getProject = async (id: string | undefined) => {
  const res = await api.get(`projects/${id}`);
  return res?.data;
};

const updateProject = async (id, data) => {
  const res = await api.post(`projects/${id}`, data);
  return res;
};

const getProjects = async (searcher) => {
  const res = await api.get(
    `projects?page=${searcher?.pagination?.current_page}&search=${searcher?.search}&category_id=${searcher?.category_id}&sort=${searcher?.sort}`,
  );
  searcher?.setPagination((prev) => ({
    ...prev,
    last_page: res?.data?.last_page,
    to: res?.data?.to,
    total: res?.data?.total,
  }));
  return res?.data?.data;
};

const createProject = async (data) => {
  const res = await api.post("projects", data);
  return res;
};

const checkProject = async (id) => {
  const res = await api.get(`projects-edit/${id}`);
  return res.data;
};

const likeProject = async (project_id) => {
  const data = { project_id };
  const res = await api.post("likes", data);
  return res;
};

const deleteComment = async (id) => {
  const res = await api.delete(`comments/${id}`);
  return res;
};

const createComment = async (data) => {
  const res = await api.post("comments", data);
  return res;
};

const deleteProject = async (id) => {
  const res = await api.delete(`projects/${id}`);
  return res;
};

export {
  getProject,
  getProjects,
  checkProject,
  likeProject,
  deleteComment,
  createComment,
  deleteProject,
  updateProject,
  createProject,
};
