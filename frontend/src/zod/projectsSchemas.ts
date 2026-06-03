import z from "zod";

const manipulateProjectSchema = (isUpdate: boolean) =>
  z.object({
    image: isUpdate
      ? z.instanceof(File).nullable().optional()
      : z.instanceof(File, { message: "Please upload a project image" }),

    title: z
      .string({ message: "Title is required" })
      .trim()
      .min(3, "Title must be at least 3 characters")
      .max(255, "Title must not exceed 255 characters"),

    description: z
      .string({ message: "Description is required" })
      .trim()
      .min(10, "Description must be at least 10 characters"),

    category_id: z.string().min(1, "Please select a category"),

    skills: z.string({ message: "Skills are required" }),

    private: z.union([z.string(), z.boolean()]),

    manifesto: z
      .string({ message: "Manifesto is required" })
      .trim()
      .min(20, "Manifesto must be at least 20 characters"),
  });

export type manipulateProjectSchemaType = z.infer<
  ReturnType<typeof manipulateProjectSchema>
>;

const destroyProjectSchema = z.object({
  title: z
    .string({ message: "Title is required" })
    .trim()
    .min(3, "Title must be at least 3 characters")
    .max(255, "Title must not exceed 255 characters"),
});

export type destroyProjectSchemaType = z.infer<typeof destroyProjectSchema>;

export { manipulateProjectSchema, destroyProjectSchema };
