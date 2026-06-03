import type { DefaultFields } from "@/assets/types";
import { api } from "../axios";
import type {
  createTaskSchemaType,
  updateTaskSchemaType,
} from "@/zod/taskSchemas";
import { toast } from "sonner";

const createTask = async (data: createTaskSchemaType) => {
  const res = await api.post("tasks", data);
  toast.success(res?.data?.message);
  return res;
};

const updateTask = async (
  id: DefaultFields["id"],
  data: updateTaskSchemaType,
) => {
  const res = await api.put(`tasks/${id}`, data);
  toast.success(res?.data?.message);
  return res;
};

const destroyTask = async (id: DefaultFields["id"]) => {
  const res = await api.delete(`tasks/${id}`);
  toast.success(res?.data?.message);
  return res;
};

export { createTask, updateTask, destroyTask };
