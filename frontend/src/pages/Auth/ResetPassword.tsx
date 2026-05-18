import AuthCard from "@/components/cards/AuthCard";
import { Button } from "@/components/ui/button";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import InputController from "@/components/controllers/InputController";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  resetPasswordSchema,
  type resetPasswordSchemaType,
} from "@/zod/authSchemas";
import { useMutation } from "@tanstack/react-query";
import { resetUserPassword } from "@/api/functions/auth";
import { handleApiErrors } from "@/api/functions/validation";
import { useAppDispatch } from "@/redux/store";

const fields = [
  {
    name: "password",
    type: "password",
    label: "New Password",
    placeholder: "Minimum 6 characters",
  },
  {
    name: "password_confirmation",
    type: "password",
    label: "Confirm Password",
    placeholder: "Re-enter new password",
  },
] as const;

export default function ResetPassword() {
  const nav = useNavigate();
  const disp = useAppDispatch();
  const userEmail = localStorage.getItem("user-email");
  const userCode = localStorage.getItem("user-code");
  const form = useForm<resetPasswordSchemaType>({
    defaultValues: {
      password: "",
      password_confirmation: "",
    },
    resolver: zodResolver(resetPasswordSchema),
  });

  const {
    mutate: resetUserPasswordMutation,
    isPending: isResetUserPasswordPending,
  } = useMutation({
    mutationFn: (data: resetPasswordSchemaType) =>
      resetUserPassword({ ...data, email: userEmail, code: userCode }, disp),
    onError: (err) => {
      handleApiErrors(err, form);
    },
    onSuccess: () => {
      nav("/reset-password");
      localStorage.removeItem("user-email");
      localStorage.removeItem("user-code");
    },
  });

  if (!userEmail || !userCode) return <Navigate to={"/"} replace />;
  return (
    <AuthCard
      title="Set a new password"
      subtitle="Make it strong and memorable."
      footer={
        <Link to="/sign-in" className="text-primary hover:underline">
          Back to sign in
        </Link>
      }
    >
      <form
        onSubmit={form.handleSubmit((data) => resetUserPasswordMutation(data))}
        className="space-y-4"
      >
        {fields.map((f, i) => (
          <InputController key={i} control={form.control} f={f} />
        ))}
        <Button
          type="submit"
          className="w-full"
          disabled={isResetUserPasswordPending}
        >
          {isResetUserPasswordPending
            ? "Resetting password..."
            : "Reset password"}
        </Button>
      </form>
    </AuthCard>
  );
}
