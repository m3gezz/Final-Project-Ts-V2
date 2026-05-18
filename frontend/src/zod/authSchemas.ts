import z from "zod";

const signUpSchema = z
  .object({
    full_name: z.string().min(3, "Name must be at least 3 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
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
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export type signInSchemaType = z.infer<typeof signInSchema>;

const verificationCodeSchema = z.object({
  code: z.string().length(6, "Code must be exactly 6 digits"),
});

export type verificationCodeSchemaType = z.infer<typeof verificationCodeSchema>;

const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export type forgotPasswordSchemaType = z.infer<typeof forgotPasswordSchema>;

const resetPasswordSchema = z
  .object({
    password: z.string().min(6, "Password must be at least 6 characters"),
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
