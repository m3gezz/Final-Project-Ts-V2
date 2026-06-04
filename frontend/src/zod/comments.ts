import z from "zod";

const createCommentSchema = z.object({
  project_id: z.string(),
  content: z.string().trim().min(1, "Comment content cannot be empty"),
});

export type createCommentSchemaType = z.infer<typeof createCommentSchema>;

const updateCommentSchema = z.object({
  content: z
    .string()
    .trim()
    .min(1, "Comment content cannot be empty")
    .optional(),
});

export type updateCommentSchemaType = z.infer<typeof updateCommentSchema>;

export { createCommentSchema, updateCommentSchema };
