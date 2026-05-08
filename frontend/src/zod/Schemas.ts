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
  img_url: z.file().nullable(),
  title: z.string(),
  description: z.string(),
  category_id: z.string(),
  skills: z.string(),
  privacy: z.string(),
  manifesto: z.string(),
});

const profileEditSchema = z.object({
  full_name: z.string(),
  username: z.string(),
  professional_title: z.string(),
  avatar_url: z.file().nullable(),
  bio: z.string(),
  about: z.string(),
  email: z.string(),
  public_profile: z.boolean(),
  status: z.boolean(),
  skills: z.string(),
  github: z.string(),
  twitter: z.string(),
  linkedin: z.string(),
  personal_web: z.string(),
});

const changePasswordSchema = z.object({
  old_password: z.string(),
  new_password: z.string(),
  new_password_confirmation: z.string(),
});

const deleteAccountSchema = z.object({
  password: z.string(),
  password_confirmation: z.string(),
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
};
