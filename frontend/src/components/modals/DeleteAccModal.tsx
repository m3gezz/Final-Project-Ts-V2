import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import InputController from "@/components/controllers/InputController";
import { zodResolver } from "@hookform/resolvers/zod";
import { deleteAccountSchema } from "@/zod/schemas";
import { DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useMutation } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { unsetAuth } from "@/redux/authSlice";
import { deleteAccount } from "@/api/functions/user";

const fields = [
  {
    name: "password",
    type: "password",
    label: "Your Password",
    placeholder: "••••••••",
  },
  {
    name: "password_confirmation",
    type: "password",
    label: "Confirm Your Password",
    placeholder: "••••••••",
  },
];

export default function DeleteAccModal({ id }) {
  const form = useForm({
    defaultValues: {
      password: "",
      password_confirmation: "",
    },
    resolver: zodResolver(deleteAccountSchema),
  });
  const disp = useDispatch();

  const { mutate, isPending } = useMutation({
    mutationFn: (data) => deleteAccount(id, data, disp),
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
    <DialogContent
      aria-describedby=""
      className="rounded-2xl border bg-card p-8"
      style={{ boxShadow: "var(--shadow-elegant)" }}
    >
      <DialogTitle>
        <div className="mb-6 text-center">
          <h1 className="text-2xl text-destructive font-semibold tracking-tight">
            Delete Account
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Just to make sure, please enter you password.
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
          variant={"destructive"}
          className="w-full"
          disabled={isPending}
        >
          {isPending ? "Deleting..." : "Delete"}
        </Button>
      </form>
    </DialogContent>
  );
}
