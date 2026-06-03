import type { createDataSchemaType } from "@/zod/data";
import { api } from "../axios";
import { toast } from "sonner";

const getSkills = async () => {
  const res = await api.get("skills");
  return res?.data;
};

const getCategories = async () => {
  const res = await api.get("categories");
  return res?.data;
};

const getBadges = async () => {
  const res = await api.get("badges");
  return res?.data;
};

const createData = async (url: string, data: createDataSchemaType) => {
  const res = await api.post(url, data);
  toast.success(res?.data?.message);
  return res;
};

const deleteData = async (url: string) => {
  const res = await api.delete(url);
  toast.success(res?.data?.message);
  return res;
};

export { getSkills, getCategories, getBadges, createData, deleteData };
