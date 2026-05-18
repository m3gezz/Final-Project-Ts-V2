import z from "zod";

const createTaskSchema = z.object({
  workspace_id: z.string(),
  title: z.string(),
  description: z.string(),
  user_id: z.string(),
});

export type createTaskSchemaType = z.infer<typeof createTaskSchema>;

const updateTaskSchema = z.object({
  status: z.string(),
});

export type updateTaskSchemaType = z.infer<typeof updateTaskSchema>;

export { createTaskSchema, updateTaskSchema };
