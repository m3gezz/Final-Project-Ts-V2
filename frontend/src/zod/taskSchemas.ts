import z from "zod";

const createTaskSchema = z.object({
  workspace_id: z.string(),
  title: z.string(),
  description: z.string(),
  user_id: z.string(),
});

export type createTaskSchemaType = z.infer<typeof createTaskSchema>;

export { createTaskSchema };
