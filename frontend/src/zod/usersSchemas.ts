import z from "zod";

const updateUserSchema = z.object({
  avatar: z.instanceof(File).nullable().optional(),
  full_name: z
    .string()
    .trim()
    .min(3, "Name must be at least 3 characters")
    .max(255),
  username: z
    .string()
    .trim()
    .min(3, "Username must be at least 3 characters")
    .max(50),
  professional_title: z.string().trim().max(100).optional(),
  bio: z.string().trim().max(160).optional(),
  about: z.string().trim().optional(),
  email: z.string().email("Invalid email address"),
  private: z.union([z.string(), z.boolean()]),
  skills: z.string(),
});

export type updateUserSchemaType = z.infer<typeof updateUserSchema>;

const updatePasswordSchema = z
  .object({
    password: z.string().min(1, "Current password is required"),
    new_password: z
      .string()
      .min(6, "New password must be at least 6 characters"),
    new_password_confirmation: z.string(),
  })
  .refine((vals) => vals.new_password === vals.new_password_confirmation, {
    message: "Passwords must match",
    path: ["new_password_confirmation"],
  });

export type updatePasswordSchemaType = z.infer<typeof updatePasswordSchema>;

const destroyUserSchema = z
  .object({
    password: z.string().min(1, "Password confirmation is required"),
    password_confirmation: z.string(),
  })
  .refine((vals) => vals.password === vals.password_confirmation, {
    message: "Passwords must match",
    path: ["password_confirmation"],
  });

export type destroyUserSchemaType = z.infer<typeof destroyUserSchema>;

export { updateUserSchema, updatePasswordSchema, destroyUserSchema };
