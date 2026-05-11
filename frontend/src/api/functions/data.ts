import { api } from "../axios";

const getSkills = async () => {
  const res = await api.get("skills");
  return res?.data;
};

const getCategories = async () => {
  const res = await api.get("categories");
  return res?.data;
};

export { getSkills, getCategories };
