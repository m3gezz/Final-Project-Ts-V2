import { Link } from "react-router-dom";
import AuthCard from "@/components/cards/AuthCard";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import InputController from "@/components/controllers/InputController";
import { useMutation } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "@/api/functions/auth";
import { signInSchema, type signInSchemaType } from "@/zod/authSchemas";
import { useAppDispatch } from "@/redux/store";
import { handleApiErrors } from "@/api/functions/validation";

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
] as const;

export default function SignIn() {
  const disp = useAppDispatch();
  const form = useForm<signInSchemaType>({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(signInSchema),
  });

  const { mutate: signInMutation, isPending: isSignInPending } = useMutation({
    mutationFn: (data: signInSchemaType) => signIn(data, disp),
    onError: (err) => {
      handleApiErrors(err, form);
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
        onSubmit={form.handleSubmit((data) => signInMutation(data))}
        className="space-y-4"
      >
        {fields.map((f, i) => (
          <InputController key={i} control={form.control} f={f} />
        ))}
        <Button type="submit" className="w-full" disabled={isSignInPending}>
          {isSignInPending ? "Signing in…" : "Sign in"}
        </Button>
      </form>
    </AuthCard>
  );
}
