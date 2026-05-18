import z from "zod";

const manipulateProjectSchema = z.object({
  image: z.instanceof(File).nullable().optional(),
  title: z
    .string()
    .trim()
    .min(3, "Title must be at least 3 characters")
    .max(255),
  description: z
    .string()
    .trim()
    .min(10, "Provide a brief description of your project"),
  category_id: z.string().min(1, "Please select a valid category"),
  skills: z.string(),
  private: z.union([z.string(), z.boolean()]),
  manifesto: z
    .string()
    .trim()
    .min(20, "Your manifesto must be a bit more detailed"),
});
export type manipulateProjectSchemaType = z.infer<
  typeof manipulateProjectSchema
>;
export { manipulateProjectSchema };
