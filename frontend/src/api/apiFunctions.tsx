import { api } from "./axios";
import { setAuth } from "@/redux/authSlice";

//Token
const refresh = async (disp) => {
  const res = await api.post("refresh");
  disp(setAuth(res?.data));
  return res;
};

const me = async (disp) => {
  const res = await api.post("me");
  disp(setAuth(res?.data));
  return res;
};

//Auth
const signIn = async (data, disp) => {
  const res = await api.post("sign-in", data);
  disp(setAuth(res?.data));
  return res;
};

const signUp = async (data, disp) => {
  const res = await api.post("sign-up", data);
  disp(setAuth(res?.data));
  return res;
};

//Data
const getUser = async (id: string | undefined) => {
  const res = await api.get(`users/${id}`);
  return res?.data?.profile;
};

const getProject = async (id: string | undefined) => {
  const res = await api.get(`projects/${id}`);
  return res?.data;
};

const getSkills = async () => {
  const res = await api.get("skills");
  return res?.data;
};

const getCategories = async () => {
  const res = await api.get("categories");
  return res?.data;
};

const getProjects = async (searcher) => {
  const res = await api.get(
    `projects?page=${searcher?.pagination?.current_page}&search=${searcher?.search}&category_id=${searcher?.category_id}&order=${searcher?.order}`,
  );
  searcher?.setPagination((prev) => ({
    ...prev,
    last_page: res?.data?.last_page,
    to: res?.data?.to,
    total: res?.data?.total,
  }));
  return res?.data?.data;
};

const getUserProjects = async (searcher) => {
  const res = await api.get(
    `user-projects/${searcher?.id}?page=${searcher?.pagination?.current_page}&type=${searcher?.showOwned && "owned"}`,
  );
  searcher?.setPagination((prev) => ({
    ...prev,
    last_page: res?.data?.last_page,
    to: res?.data?.to,
    total: res?.data?.total,
  }));

  return res?.data?.data;
};

const editProject = async (id) => {
  const res = api.get(`projects-edit/${id}`);
  return res;
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

export {
  refresh,
  me,
  signUp,
  signIn,
  getProject,
  getSkills,
  getUser,
  getCategories,
  getProjects,
  editProject,
  likeProject,
  deleteComment,
  createComment,
  getUserProjects,
  requestJoin,
  getInbox,
  cancelRequest,
};
