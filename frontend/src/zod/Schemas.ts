import z from "zod";

//Auth
const signUpSchema = z
  .object({
    full_name: z.string(),
    email: z.email(),
    password: z.string(),
    password_confirmation: z.string(),
    terms: z.boolean(),
  })
  .refine((vals) => vals.password === vals.password_confirmation, {
    message: "Passwords must match",
    path: ["password_confirmation"],
  })
  .refine((vals) => vals.terms, {
    message: "Terms must be accepted",
    path: ["terms"],
  });
const signInSchema = z.object({
  email: z.email(),
  password: z.string(),
});
const forgotPasswordSchema = z.object({
  email: z.email(),
});
const verificationCodeSchema = z.object({
  code: z.string().length(6),
});
const resetPasswordSchema = z
  .object({
    password: z.string(),
    password_confirmation: z.string(),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Passwords must match",
    path: ["password_confirmation"],
  });

//Projects
const createProjectSchema = z.object({
  image: z.file().nullable(),
  title: z.string(),
  description: z.string(),
  category_id: z.string(),
  skills: z.string(),
  private: z.boolean(),
  manifesto: z.string(),
});

const userEditSchema = z.object({
  avatar: z.file().nullable(),
  full_name: z.string(),
  username: z.string(),
  professional_title: z.string(),
  bio: z.string(),
  about: z.string(),
  email: z.string(),
  private: z.boolean(),
  skills: z.string(),
});

const modifyPasswordSchema = z
  .object({
    password: z.string(),
    new_password: z.string(),
    new_password_confirmation: z.string(),
  })
  .refine((vals) => vals.new_password === vals.new_password_confirmation, {
    message: "Passwords must match",
    path: ["new_password_confirmation"],
  });

const deleteAccountSchema = z
  .object({
    password: z.string(),
    password_confirmation: z.string(),
  })
  .refine((vals) => vals.password === vals.password_confirmation, {
    message: "Passwords must match",
    path: ["password_confirmation"],
  });

const createCommentSchema = z.object({
  content: z.string(),
  project_id: z.number(),
});

export {
  signUpSchema,
  signInSchema,
  verificationCodeSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  userEditSchema,
  deleteAccountSchema,
  modifyPasswordSchema,
  createProjectSchema,
};
