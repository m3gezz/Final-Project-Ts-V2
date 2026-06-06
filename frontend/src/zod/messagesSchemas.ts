import z from "zod";

const createMessageSchema = z.object({
  workspace_id: z.string(),
  message: z.string().trim().min(1, "Message content cannot be empty"),
});

export type createMessageSchemaType = z.infer<typeof createMessageSchema>;

const createAttachmentSchema = z.object({
  workspace_id: z.string(),
  message: z
    .string()
    .trim()
    .min(1, "Message content cannot be empty")
    .optional(),
  file: z.instanceof(File, { message: "A valid file must be provided" }),
});

export type createAttachmentSchemaType = z.infer<typeof createAttachmentSchema>;

const updateMessageSchema = z.object({
  message: z
    .string()
    .trim()
    .min(1, "Message content cannot be empty")
    .optional(),
  isPinned: z.boolean().optional(),
});

export type updateMessageSchemaType = z.infer<typeof updateMessageSchema>;

export { createMessageSchema, createAttachmentSchema, updateMessageSchema };
