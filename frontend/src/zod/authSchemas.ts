import z from "zod";

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

export type signUpSchemaType = z.infer<typeof signUpSchema>;

const signInSchema = z.object({
  email: z.email(),
  password: z.string(),
});

export type signInSchemaType = z.infer<typeof signInSchema>;

const verificationCodeSchema = z.object({
  code: z.string().length(6),
});

export type verificationCodeSchemaType = z.infer<typeof verificationCodeSchema>;

const forgotPasswordSchema = z.object({
  email: z.email(),
});

export type forgotPasswordSchemaType = z.infer<typeof forgotPasswordSchema>;

const resetPasswordSchema = z
  .object({
    password: z.string(),
    password_confirmation: z.string(),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Passwords must match",
    path: ["password_confirmation"],
  });

export type resetPasswordSchemaType = z.infer<typeof resetPasswordSchema>;

export {
  signUpSchema,
  signInSchema,
  verificationCodeSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
};
