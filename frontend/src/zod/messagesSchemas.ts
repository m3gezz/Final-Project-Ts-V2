import z from "zod";

const createMessageSchema = z.object({
  workspace_id: z.string(),
  message: z.string(),
});

export type createMessageSchemaType = z.infer<typeof createMessageSchema>;

const updateMessageSchema = z.object({
  message: z.string(),
});

export type updateMessageSchemaType = z.infer<typeof updateMessageSchema>;

export { createMessageSchema, updateMessageSchema };
