import z from "zod";

const updateUserSchema = z.object({
  avatar: z.file().nullable(),
  full_name: z.string(),
  username: z.string(),
  professional_title: z.string(),
  bio: z.string(),
  about: z.string(),
  email: z.string(),
  private: z.union([z.boolean(), z.string()]),
  skills: z.string(),
});

export type updateUserSchemaType = z.infer<typeof updateUserSchema>;

const updatePasswordSchema = z
  .object({
    password: z.string(),
    new_password: z.string(),
    new_password_confirmation: z.string(),
  })
  .refine((vals) => vals.new_password === vals.new_password_confirmation, {
    message: "Passwords must match",
    path: ["new_password_confirmation"],
  });

export type updatePasswordSchemaType = z.infer<typeof updatePasswordSchema>;

const destroyUserSchema = z
  .object({
    password: z.string(),
    password_confirmation: z.string(),
  })
  .refine((vals) => vals.password === vals.password_confirmation, {
    message: "Passwords must match",
    path: ["password_confirmation"],
  });

export type destroyUserSchemaType = z.infer<typeof destroyUserSchema>;

export { updateUserSchema, updatePasswordSchema, destroyUserSchema };
