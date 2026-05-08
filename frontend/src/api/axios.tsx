import { store } from "@/redux/store";
import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api/",
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    const token = store.getState().auth.token;
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error),
);

export { api };
