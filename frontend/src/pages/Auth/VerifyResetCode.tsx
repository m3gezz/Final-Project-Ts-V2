import AuthCard from "@/components/cards/AuthCard";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import InputOTPController from "@/components/controllers/InputOTPController";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { verificationCodeSchema } from "@/zod/schemas";

export default function VerifyResetCode() {
  const form = useForm({
    defaultValues: {
      code: "",
    },
    resolver: zodResolver(verificationCodeSchema),
  });

  const onSubmit = (data) => {
    console.log(data);
  };

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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <InputOTPController
          control={form.control}
          f={{
            name: "code",
          }}
        />
        <Button type="submit" className="w-full">
          Continue
        </Button>
      </form>
    </AuthCard>
  );
}
