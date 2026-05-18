import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import AuthCard from "@/components/cards/AuthCard";
import { useForm } from "react-hook-form";
import InputController from "@/components/controllers/InputController";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  forgotPasswordSchema,
  type forgotPasswordSchemaType,
} from "@/zod/authSchemas";
import { useMutation } from "@tanstack/react-query";
import { sendPasswordResetCode } from "@/api/functions/auth";
import { handleApiErrors } from "@/api/functions/validation";

export default function ForgotPassword() {
  const nav = useNavigate();
  const form = useForm<forgotPasswordSchemaType>({
    defaultValues: {
      email: "",
    },
    resolver: zodResolver(forgotPasswordSchema),
  });

  const {
    mutate: sendPasswordResetCodeMutation,
    isPending: isSendPasswordResetCodePending,
  } = useMutation({
    mutationFn: (data: forgotPasswordSchemaType) => sendPasswordResetCode(data),
    onMutate: (data) => {
      localStorage.setItem("user-email", String(data?.email));
    },
    onError: (err) => {
      handleApiErrors(err, form);
    },
    onSuccess: () => {
      nav("/verify-reset-code");
    },
  });

  return (
    <AuthCard
      title="Forgot your password?"
      subtitle="Enter your email and we'll send a reset code."
      footer={
        <Link to="/sign-in" className="text-primary hover:underline">
          Back to sign in
        </Link>
      }
    >
      <form
        onSubmit={form.handleSubmit((data) =>
          sendPasswordResetCodeMutation(data),
        )}
        className="space-y-4"
      >
        <InputController
          control={form.control}
          f={{
            name: "email",
            type: "text",
            label: "Email",
            placeholder: "you@company.com",
          }}
        />
        <Button
          type="submit"
          className="w-full"
          disabled={isSendPasswordResetCodePending}
        >
          {isSendPasswordResetCodePending ? "Sending..." : "Send reset code"}
        </Button>
      </form>
    </AuthCard>
  );
}
