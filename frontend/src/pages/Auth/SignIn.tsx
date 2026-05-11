import { Link } from "react-router-dom";
import AuthCard from "@/components/cards/AuthCard";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import InputController from "@/components/controllers/InputController";
import { useMutation } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { signInSchema } from "@/zod/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "@/api/functions/ayth";

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
  const disp = useDispatch();
  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(signInSchema),
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (data) => signIn(data, disp),
    onError: (err) => {
      const res = err.response;
      if (res.status !== 422) return alert("error");

      const errors = res.data.errors;
      for (const key in errors) {
        form.setError(key, { message: errors[key] });
      }
    },
  });

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
      <form
        onSubmit={form.handleSubmit((data) => mutate(data))}
        className="space-y-4"
      >
        {fields.map((f, i) => (
          <InputController key={i} control={form.control} f={f} />
        ))}
        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? "Signing in…" : "Sign in"}
        </Button>
      </form>
    </AuthCard>
  );
}
