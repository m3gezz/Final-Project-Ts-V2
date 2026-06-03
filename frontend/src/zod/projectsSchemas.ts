import z from "zod";

const manipulateProjectSchema = (isUpdate: boolean) =>
  z.object({
    image: isUpdate
      ? z.instanceof(File).nullable().optional()
      : z.instanceof(File, { message: "Image is required" }),

    title: z.string().trim().min(3).max(255),
    description: z.string().trim().min(10),
    category_id: z.string().min(1),
    skills: z.string(),
    private: z.union([z.string(), z.boolean()]),
    manifesto: z.string().trim().min(20),
  });
export type manipulateProjectSchemaType = z.infer<
  ReturnType<typeof manipulateProjectSchema>
>;

export { manipulateProjectSchema };
