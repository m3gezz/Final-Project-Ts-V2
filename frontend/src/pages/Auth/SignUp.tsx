import { Link } from "react-router-dom";
import AuthCard from "@/components/cards/AuthCard";
import { Button } from "@/components/ui/button";
import InputController from "@/components/controllers/InputController";
import { useForm } from "react-hook-form";
import CheckBoxController from "@/components/controllers/CheckBoxController";
import { useDispatch } from "react-redux";
import { useMutation } from "@tanstack/react-query";
import { signUpSchema } from "@/zod/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { signUp } from "@/api/functions/ayth";

const infoFields = [
  {
    name: "full_name",
    type: "text",
    label: "Full Name",
    placeholder: "",
  },
  {
    name: "email",
    type: "text",
    label: "Email",
    placeholder: "you@company.com",
  },
];

const passwordFields = [
  {
    name: "password",
    type: "password",
    label: "Password",
    placeholder: "••••••••",
  },
  {
    name: "password_confirmation",
    type: "password",
    label: "Confirm Password",
    placeholder: "••••••••",
  },
];

export default function SignUp() {
  const disp = useDispatch();
  const form = useForm({
    defaultValues: {
      full_name: "",
      email: "",
      password: "",
      password_confirmation: "",
      terms: false,
    },
    resolver: zodResolver(signUpSchema),
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (data) => signUp(data, disp),
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
      title="Create your account"
      subtitle="Start sharing ideas and building teams."
      footer={
        <>
          Already have an account?{" "}
          <Link to="/sign-in" className="text-primary hover:underline">
            Sign in
          </Link>
        </>
      }
    >
      <form
        onSubmit={form.handleSubmit((data) => mutate(data))}
        className="space-y-4"
      >
        {infoFields.map((f, i) => (
          <InputController key={i} control={form.control} f={f} />
        ))}

        <div className="grid grid-cols-2 gap-3">
          {passwordFields.map((f, i) => (
            <InputController key={i} control={form.control} f={f} />
          ))}
        </div>
        <CheckBoxController
          control={form.control}
          f={{
            name: "terms",
          }}
        />
        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? "Creating account…" : "Create account"}
        </Button>
      </form>
    </AuthCard>
  );
}
