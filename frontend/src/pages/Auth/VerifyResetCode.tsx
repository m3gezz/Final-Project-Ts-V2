import AuthCard from "@/components/cards/AuthCard";
import { Button } from "@/components/ui/button";
import { Link, Navigate, useNavigate } from "react-router-dom";
import InputOTPController from "@/components/controllers/InputOTPController";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  verificationCodeSchema,
  type verificationCodeSchemaType,
} from "@/zod/authSchemas";
import { useMutation } from "@tanstack/react-query";
import { sendPasswordResetCode, verifyResetCode } from "@/api/functions/auth";
import { handleApiErrors } from "@/api/functions/validation";

export default function VerifyResetCode() {
  const nav = useNavigate();
  const userEmail = localStorage.getItem("user-email");
  const form = useForm<verificationCodeSchemaType>({
    defaultValues: {
      code: "",
    },
    resolver: zodResolver(verificationCodeSchema),
  });

  const {
    mutate: verifyResetCodeMutation,
    isPending: isVerifyResetCodePending,
  } = useMutation({
    mutationFn: (data: verificationCodeSchemaType) =>
      verifyResetCode({ ...data, email: userEmail }),
    onMutate: (data) => {
      localStorage.setItem("user-code", String(data?.code));
    },
    onError: (err) => {
      handleApiErrors(err, form);
    },
    onSuccess: () => {
      nav("/reset-password");
    },
  });

  const {
    mutate: sendPasswordResetCodeMutation,
    isPending: isSendPasswordResetCodePending,
  } = useMutation({
    mutationFn: () => sendPasswordResetCode({ email: userEmail }),
  });

  if (!userEmail) return <Navigate to={"/"} replace />;
  return (
    <AuthCard
      title="Enter reset code"
      subtitle="Check your email for the 6-digit code."
      footer={
        <Link to="/sign-in" className="text-primary hover:underline">
          Back to sign in
        </Link>
      }
    >
      <form
        onSubmit={form.handleSubmit((data) => verifyResetCodeMutation(data))}
        className="space-y-6"
      >
        <InputOTPController
          control={form.control}
          f={{
            name: "code",
          }}
        />
        <Button
          type="submit"
          className="w-full"
          disabled={isVerifyResetCodePending}
        >
          {isVerifyResetCodePending ? "Verifying..." : "Verify reset code"}
        </Button>
        <p className="text-center text-xs text-muted-foreground">
          Didn't get the email?{" "}
          <button
            type="button"
            className="text-primary hover:underline"
            disabled={isSendPasswordResetCodePending}
            onClick={() => sendPasswordResetCodeMutation()}
          >
            {isSendPasswordResetCodePending ? "Resending..." : "Resend"}
          </button>
        </p>
      </form>
    </AuthCard>
  );
}
