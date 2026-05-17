import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import AuthCard from "@/components/cards/AuthCard";
import { useForm } from "react-hook-form";
import InputController from "@/components/controllers/InputController";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  forgotPasswordSchema,
  type forgotPasswordSchemaType,
} from "@/zod/authSchemas";

export default function ForgotPassword() {
  const form = useForm<forgotPasswordSchemaType>({
    defaultValues: {
      email: "",
    },
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = (data: forgotPasswordSchemaType) => {
    console.log(data);
  };

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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <InputController
          control={form.control}
          f={{
            name: "email",
            type: "text",
            label: "Email",
            placeholder: "you@company.com",
          }}
        />
        <Button type="submit" className="w-full">
          Send reset code
        </Button>
      </form>
    </AuthCard>
  );
}
