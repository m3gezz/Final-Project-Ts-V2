import AuthCard from "@/components/cards/AuthCard";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import InputController from "@/components/controllers/InputController";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  resetPasswordSchema,
  type resetPasswordSchemaType,
} from "@/zod/authSchemas";

const fields = [
  {
    name: "password",
    type: "password",
    label: "New Password",
    placeholder: "••••••••",
  },
  {
    name: "password_confirmation",
    type: "password",
    label: "Confirm New Password",
    placeholder: "••••••••",
  },
] as const;

export default function ResetPassword() {
  const form = useForm<resetPasswordSchemaType>({
    defaultValues: {
      password: "",
      password_confirmation: "",
    },
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = (data: resetPasswordSchemaType) => {
    console.log(data);
  };

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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {fields.map((f, i) => (
          <InputController key={i} control={form.control} f={f} />
        ))}
        <Button type="submit" className="w-full">
          Reset password
        </Button>
      </form>
    </AuthCard>
  );
}
