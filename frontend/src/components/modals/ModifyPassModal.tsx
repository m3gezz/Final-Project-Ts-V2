import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import InputController from "@/components/controllers/InputController";
import { zodResolver } from "@hookform/resolvers/zod";
import { modifyPasswordSchema } from "@/zod/schemas";
import { DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useMutation } from "@tanstack/react-query";
import { updatePassword } from "@/api/functions/user";
import { useNavigate, useParams } from "react-router-dom";

const fields = [
  {
    name: "password",
    type: "password",
    label: "Old Password",
    placeholder: "••••••••",
  },
  {
    name: "new_password",
    type: "password",
    label: "New Password",
    placeholder: "••••••••",
  },
  {
    name: "new_password_confirmation",
    type: "password",
    label: "Confirm New Password",
    placeholder: "••••••••",
  },
];

export default function ModifyPassModal() {
  const { id } = useParams();
  const form = useForm({
    defaultValues: {
      password: "",
      new_password: "",
      new_password_confirmation: "",
    },
    resolver: zodResolver(modifyPasswordSchema),
  });

  const nav = useNavigate();

  const { mutate, isPending } = useMutation({
    mutationFn: (data) => updatePassword(id, data),
    onError: (err) => {
      const res = err.response;
      if (res.status !== 422) return alert("error");

      const errors = res.data.errors;
      for (const key in errors) {
        form.setError(key, { message: errors[key] });
      }
    },
    onSuccess: () => {
      nav(-1);
    },
  });

  return (
    <DialogContent
      aria-describedby=""
      className="rounded-2xl border bg-card p-8"
      style={{ boxShadow: "var(--shadow-elegant)" }}
    >
      <DialogTitle>
        <div className="mb-6 text-center">
          <h1 className="text-2xl text-primary font-semibold tracking-tight">
            Change password
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Enter old and new password.
          </p>
        </div>
      </DialogTitle>
      <form className="space-y-4">
        {fields.map((f, i) => (
          <InputController key={i} control={form.control} f={f} />
        ))}
        <Button
          type="button"
          onClick={form.handleSubmit((data) => mutate(data))}
          className="w-full"
          disabled={isPending}
        >
          {isPending ? "Modifying..." : "Modify"}
        </Button>
      </form>
    </DialogContent>
  );
}
