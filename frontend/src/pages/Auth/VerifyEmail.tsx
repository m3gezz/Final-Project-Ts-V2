import AuthCard from "@/components/cards/AuthCard";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";
import { useForm } from "react-hook-form";
import InputOTPController from "@/components/controllers/InputOTPController";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import {
  resendEmailVerificationCode,
  signOut,
  verifyEmailCode,
} from "@/api/functions/auth";
import {
  verificationCodeSchema,
  type verificationCodeSchemaType,
} from "@/zod/authSchemas";
import { useAppDispatch } from "@/redux/store";
import { handleApiErrors } from "@/api/functions/validation";

export default function VerifyEmail() {
  const disp = useAppDispatch();
  const form = useForm<verificationCodeSchemaType>({
    defaultValues: {
      code: "",
    },
    resolver: zodResolver(verificationCodeSchema),
  });

  const { mutate: signOutMutation, isPending: isSignOutPending } = useMutation({
    mutationFn: () => signOut(disp),
  });

  const {
    mutate: verifyEmailCodeMutation,
    isPending: isVerifyEmailCodePending,
  } = useMutation({
    mutationFn: (data: verificationCodeSchemaType) =>
      verifyEmailCode(data, disp),
    onError: (err) => {
      handleApiErrors(err, form);
    },
  });

  const {
    mutate: resendEmailVerificationCodeMutation,
    isPending: isResendEmailVerificationCodePending,
  } = useMutation({
    mutationFn: () => resendEmailVerificationCode(disp),
  });

  return (
    <AuthCard
      title="Verify your email"
      subtitle="We sent a 6-digit code to your inbox."
      footer={
        <button
          onClick={() => signOutMutation()}
          className="text-primary hover:underline"
          disabled={isSignOutPending}
        >
          {isSignOutPending ? "Backing up..." : "Back to sign in"}
        </button>
      }
    >
      <div className="mb-6 flex justify-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-accent text-accent-foreground">
          <Mail className="h-6 w-6" />
        </div>
      </div>
      <form
        onSubmit={form.handleSubmit((data) => verifyEmailCodeMutation(data))}
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
          disabled={isVerifyEmailCodePending}
        >
          {isVerifyEmailCodePending ? "Verifying..." : "Verify and continue"}
        </Button>
        <p className="text-center text-xs text-muted-foreground">
          Didn't get the email?{" "}
          <button
            type="button"
            className="text-primary hover:underline"
            disabled={isResendEmailVerificationCodePending}
            onClick={() => resendEmailVerificationCodeMutation()}
          >
            {isResendEmailVerificationCodePending ? "Resending..." : "Resend"}
          </button>
        </p>
      </form>
    </AuthCard>
  );
}
