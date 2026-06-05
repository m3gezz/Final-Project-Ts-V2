import z from "zod";

const createMessageSchema = z.object({
  workspace_id: z.string(),
  message: z.string().trim().min(1, "Message content cannot be empty"),
});

export type createMessageSchemaType = z.infer<typeof createMessageSchema>;

const createFileMessageSchema = z.object({
  workspace_id: z.string(),
  message: z
    .string()
    .trim()
    .min(1, "Message content cannot be empty")
    .optional(),
  type: z.enum(["file", "image", "video", "audio"]),
  file: z.instanceof(File, { message: "A valid file must be provided" }),
});

export type createFileMessageSchemaType = z.infer<
  typeof createFileMessageSchema
>;

const updateMessageSchema = z.object({
  message: z
    .string()
    .trim()
    .min(1, "Message content cannot be empty")
    .optional(),
  isPinned: z.boolean().optional(),
});

export type updateMessageSchemaType = z.infer<typeof updateMessageSchema>;

export { createMessageSchema, updateMessageSchema };
