import type { DefaultFields } from "@/assets/types";
import { api } from "../axios";
import type {
  createMessageSchemaType,
  updateMessageSchemaType,
} from "@/zod/messagesSchemas";

const getMessages = async (id: DefaultFields["id"]) => {
  const res = await api.get(`messages?workspace_id=${id}`);
  return res?.data;
};

const createMessage = async (data: createMessageSchemaType) => {
  const res = await api.post(`messages`, data);
  return res;
};

const updateMessage = async (
  id: DefaultFields["id"],
  data: updateMessageSchemaType,
) => {
  const res = await api.patch(`messages/${id}`, data);
  return res;
};

const destroyMessage = async (id: DefaultFields["id"]) => {
  const res = await api.delete(`messages/${id}`);
  return res;
};

export { getMessages, createMessage, updateMessage, destroyMessage };
