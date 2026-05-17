import { Link } from "react-router-dom";
import AuthCard from "@/components/cards/AuthCard";
import { Button } from "@/components/ui/button";
import InputController from "@/components/controllers/InputController";
import { useForm } from "react-hook-form";
import CheckBoxController from "@/components/controllers/CheckBoxController";
import { useMutation } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { signUp } from "@/api/functions/auth";
import { signUpSchema, type signUpSchemaType } from "@/zod/authSchemas";
import { useAppDispatch } from "@/redux/store";
import { handleApiErrors } from "@/api/functions/validation";

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
] as const;

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
] as const;

export default function SignUp() {
  const disp = useAppDispatch();
  const form = useForm<signUpSchemaType>({
    defaultValues: {
      full_name: "",
      email: "",
      password: "",
      password_confirmation: "",
      terms: false,
    },
    resolver: zodResolver(signUpSchema),
  });

  const { mutate: signUpMutation, isPending: isSignUpPending } = useMutation({
    mutationFn: (data: signUpSchemaType) => signUp(data, disp),
    onError: (err) => {
      handleApiErrors(err, form);
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
        onSubmit={form.handleSubmit((data) => signUpMutation(data))}
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
        <Button type="submit" className="w-full" disabled={isSignUpPending}>
          {isSignUpPending ? "Creating account…" : "Create account"}
        </Button>
      </form>
    </AuthCard>
  );
}
