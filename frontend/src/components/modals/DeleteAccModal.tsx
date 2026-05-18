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
import { destroyUser } from "@/api/functions/users";
import {
  destroyUserSchema,
  type destroyUserSchemaType,
} from "@/zod/usersSchemas";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { handleApiErrors } from "@/api/functions/validation";

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
] as const;

export default function DeleteAccModal() {
  const { user } = useAppSelector((state) => state?.auth);
  const form = useForm<destroyUserSchemaType>({
    defaultValues: {
      password: "",
      password_confirmation: "",
    },
    resolver: zodResolver(destroyUserSchema),
  });
  const disp = useAppDispatch();

  const { mutate: destroyUserMutation, isPending: isDestroyUserPending } =
    useMutation({
      mutationFn: (data: destroyUserSchemaType) =>
        destroyUser(user?.id, data, disp),
      onError: (err) => {
        handleApiErrors(err, form);
      },
    });

  return (
    <DialogContent
      aria-describedby=""
      className="rounded-2xl border bg-card p-8"
    >
      <DialogHeader>
        <DialogTitle>Delete Account</DialogTitle>
        <DialogDescription>
          Just to make sure, please enter you password.
        </DialogDescription>
      </DialogHeader>
      <form className="space-y-4">
        {fields.map((f, i) => (
          <InputController key={i} control={form.control} f={f} />
        ))}
        <Button
          type="button"
          onClick={form.handleSubmit((data) => destroyUserMutation(data))}
          variant={"destructive"}
          className="w-full"
          disabled={isDestroyUserPending}
        >
          {isDestroyUserPending ? "Deleting..." : "Delete"}
        </Button>
      </form>
    </DialogContent>
  );
}
