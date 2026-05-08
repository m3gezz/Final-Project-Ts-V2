import { Link } from "react-router-dom";
import AuthCard from "@/components/cards/AuthCard";
import { Button } from "@/components/ui/button";
import InputController from "@/components/controllers/InputController";
import { useForm } from "react-hook-form";
import CheckBoxController from "@/components/controllers/CheckBoxController";

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
  const form = useForm({
    defaultValues: {
      full_name: "",
      email: "",
      password: "",
      password_confirmation: "",
      terms: false,
    },
  });

  const onSubmit = (data) => {
    console.log(data);
  };

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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
        <Button
          type="submit"
          className="w-full"
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? "Creating account…" : "Create account"}
        </Button>
      </form>
    </AuthCard>
  );
}
