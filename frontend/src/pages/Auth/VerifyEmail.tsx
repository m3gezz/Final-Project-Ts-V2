import AuthCard from "@/components/cards/AuthCard";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";
import { useForm } from "react-hook-form";
import InputOTPController from "@/components/controllers/InputOTPController";

export default function VerifyEmail() {
  const form = useForm({
    defaultValues: {
      code: "",
    },
  });

  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <AuthCard
      title="Verify your email"
      subtitle="We sent a 6-digit code to your inbox."
      footer={
        <button className="text-primary hover:underline">
          Back to sign in
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
