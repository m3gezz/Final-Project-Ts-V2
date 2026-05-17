import z from "zod";

const manipulateProjectSchema = z.object({
  image: z.file().nullable(),
  title: z.string(),
  description: z.string(),
  category_id: z.string(),
  skills: z.string(),
  private: z.boolean(),
  manifesto: z.string(),
});
export type manipulateProjectSchemaType = z.infer<
  typeof manipulateProjectSchema
>;
export { manipulateProjectSchema };
