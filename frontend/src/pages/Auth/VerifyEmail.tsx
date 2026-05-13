import AuthCard from "@/components/cards/AuthCard";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";
import { useForm } from "react-hook-form";
import InputOTPController from "@/components/controllers/InputOTPController";
import { zodResolver } from "@hookform/resolvers/zod";
import { verificationCodeSchema } from "@/zod/schemas";
import { useMutation } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { signOut } from "@/api/functions/auth";

export default function VerifyEmail() {
  const disp = useDispatch();
  const form = useForm({
    defaultValues: {
      code: "",
    },
    resolver: zodResolver(verificationCodeSchema),
  });

  const onSubmit = (data) => {
    console.log(data);
  };

  const { mutate, isPending } = useMutation({
    mutationFn: () => signOut(disp),
  });

  return (
    <AuthCard
      title="Verify your email"
      subtitle="We sent a 6-digit code to your inbox."
      footer={
        <button
          onClick={() => mutate()}
          className="text-primary hover:underline"
          disabled={isPending}
        >
          {isPending ? "Backing up..." : "Back to sign in"}
        </button>
      }
    >
      <div className="mb-6 flex justify-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-accent text-accent-foreground">
          <Mail className="h-6 w-6" />
        </div>
      </div>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <InputOTPController
          control={form.control}
          f={{
            name: "code",
          }}
        />
        <Button type="submit" className="w-full">
          Verify and continue
        </Button>
        <p className="text-center text-xs text-muted-foreground">
          Didn't get the email?{" "}
          <button type="button" className="text-primary hover:underline">
            Resend
          </button>
        </p>
      </form>
    </AuthCard>
  );
}
