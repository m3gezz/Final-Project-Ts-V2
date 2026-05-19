import z from "zod";

export const getCreateDataSchema = (title: string) => {
  return z
    .object({
      label: z.string().trim().min(1, "Label cannot be empty"),
      description: z.string().trim().optional(),
    })
    .superRefine((data, ctx) => {
      if (title === "Badges") {
        if (!data.description || data.description.length === 0) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Description cannot be empty",
            path: ["description"],
          });
        }
      }
    });
};

type SchemaType = ReturnType<typeof getCreateDataSchema>;
export type createDataSchemaType = z.infer<SchemaType>;
