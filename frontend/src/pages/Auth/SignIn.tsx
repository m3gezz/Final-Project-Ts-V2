import { Link } from "react-router-dom";
import AuthCard from "@/components/cards/AuthCard";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import InputController from "@/components/controllers/InputController";

const fields = [
  {
    name: "email",
    type: "text",
    label: "Email",
    placeholder: "you@company.com",
  },
  {
    name: "password",
    type: "password",
    label: "Password",
    placeholder: "••••••••",
    link: {
      label: "Forgot?",
      path: "/forgot-password",
    },
  },
];

export default function SignIn() {
  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <AuthCard
      title="Welcome back"
      subtitle="Sign in to continue collaborating."
      footer={
        <>
          New here?{" "}
          <Link to="/sign-up" className="text-primary hover:underline">
            Create an account
          </Link>
        </>
      }
    >
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {fields.map((f, i) => (
          <InputController key={i} control={form.control} f={f} />
        ))}
        <Button
          type="submit"
          className="w-full"
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? "Signing in…" : "Sign in"}
        </Button>
      </form>
    </AuthCard>
  );
}
