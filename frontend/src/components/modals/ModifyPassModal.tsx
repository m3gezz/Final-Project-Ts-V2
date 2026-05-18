import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import InputController from "@/components/controllers/InputController";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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

  const { mutate: updatePasswordMutation, isPending: isUpdatePasswordPending } =
    useMutation({
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
    >
      <DialogHeader>
        <DialogTitle>Change password</DialogTitle>
        <DialogDescription>Enter old and new password.</DialogDescription>
      </DialogHeader>

      <form className="space-y-4">
        {fields.map((f, i) => (
          <InputController key={i} control={form.control} f={f} />
        ))}
        <Button
          type="button"
          onClick={form.handleSubmit((data) => updatePasswordMutation(data))}
          className="w-full"
          disabled={isUpdatePasswordPending}
        >
          {isUpdatePasswordPending ? "Modifying..." : "Modify"}
        </Button>
      </form>
    </DialogContent>
  );
}
