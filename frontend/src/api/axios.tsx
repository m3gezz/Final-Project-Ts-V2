import { store } from "@/redux/store";
import axios from "axios";

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api/`,
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    const token = store.getState().auth?.token;
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error),
);

export { api };
