import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import InputController from "@/components/controllers/InputController";
import { zodResolver } from "@hookform/resolvers/zod";
import { DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useMutation } from "@tanstack/react-query";
import { updatePassword } from "@/api/functions/users";
import { useNavigate } from "react-router-dom";
import {
  updatePasswordSchema,
  type updatePasswordSchemaType,
} from "@/zod/usersSchemas";
import { useAppSelector } from "@/redux/store";
import { handleApiErrors } from "@/api/functions/validation";

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
] as const;

export default function ModifyPassModal() {
  const { user } = useAppSelector((state) => state?.auth);
  const form = useForm<updatePasswordSchemaType>({
    defaultValues: {
      password: "",
      new_password: "",
      new_password_confirmation: "",
    },
    resolver: zodResolver(updatePasswordSchema),
  });

  const nav = useNavigate();

  const { mutate, isPending } = useMutation({
    mutationFn: (data: updatePasswordSchemaType) =>
      updatePassword(user?.id, data),
    onError: (err) => {
      handleApiErrors(err, form);
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
