import z from "zod";

const createTaskSchema = z.object({
  workspace_id: z.string(),
  title: z.string().trim().min(1, "Task title is required").max(255),
  description: z.string().trim().optional(),
  user_id: z.string().min(1, "Assigned user is required"),
});

export type createTaskSchemaType = z.infer<typeof createTaskSchema>;

const updateTaskSchema = z.object({
  status: z.enum(["todo", "doing", "done"]),
});

export type updateTaskSchemaType = z.infer<typeof updateTaskSchema>;

export { createTaskSchema, updateTaskSchema };
