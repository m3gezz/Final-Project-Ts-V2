import type { DefaultFields } from "@/assets/types";
import { api } from "../axios";
import type {
  createFileMessageSchemaType,
  createMessageSchemaType,
  updateMessageSchemaType,
} from "@/zod/messagesSchemas";
import { toast } from "sonner";

const getMessages = async (id: DefaultFields["id"]) => {
  const res = await api.get(`messages?workspace_id=${id}`);
  return res?.data;
};

const createMessage = async (
  data: createMessageSchemaType | createFileMessageSchemaType,
) => {
  const res = await api.post(`messages`, data);
  return res;
};

const updateMessage = async (
  id: DefaultFields["id"],
  data: updateMessageSchemaType,
) => {
  const res = await api.patch(`messages/${id}`, data);
  toast.success(res?.data?.message);
  return res;
};

const destroyMessage = async (id: DefaultFields["id"]) => {
  const res = await api.delete(`messages/${id}`);
  toast.success(res?.data?.message);
  return res;
};

export { getMessages, createMessage, updateMessage, destroyMessage };
