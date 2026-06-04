import type { PopulatedMessage } from "@/assets/types";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { Button } from "../ui/button";
import { useParams } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import InputController from "../controllers/InputController";
import { toggleModal } from "@/redux/modalSlice";
import { useEffect } from "react";
import { updateMessage } from "@/api/functions/messages";
import type { updateMessageSchemaType } from "@/zod/messagesSchemas";

export default function UpdateMessageModal() {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const disp = useAppDispatch();
  const { value } = useAppSelector((state) => state?.modal);
  const { isUpdateMessage } = useAppSelector((state) => state?.modal);
  const form = useForm<updateMessageSchemaType>({
    defaultValues: {
      message: "",
    },
  });

  useEffect(() => {
    form.reset({ message: value?.message });
  }, [value]);

  const { mutate: updateMessageMutation, isPending: isUpdateMessagePending } =
    useMutation({
      mutationFn: (data: updateMessageSchemaType) =>
        updateMessage(value?.id, data),
      onMutate: (data) => {
        queryClient.cancelQueries();
        disp(toggleModal({ name: "isUpdateMessage" }));
        const previous = queryClient.getQueryData(["messages", String(id)]);
        queryClient.setQueryData(
          ["messages", String(id)],
          (old: PopulatedMessage[]) => [
            ...old?.map((m) => {
              if (m?.id == value?.id) {
                return { ...m, ...data };
              }
              return m;
            }),
          ],
        );
        return { previous };
      },
    });
  return (
    <Dialog
      open={isUpdateMessage}
      onOpenChange={() => disp(toggleModal({ name: "isUpdateMessage" }))}
    >
      <DialogContent
        aria-describedby=""
        className="rounded-2xl border bg-card p-8"
      >
        <DialogHeader>
          <DialogTitle>Edit your comment</DialogTitle>
          <DialogDescription>
            Continuing means that your comment will be changed, and marked as
            so.
          </DialogDescription>
        </DialogHeader>

        <form
          className="space-y-4"
          onSubmit={form.handleSubmit((data) => updateMessageMutation(data))}
        >
          <InputController
            control={form.control}
            f={{
              name: "message",
              type: "text",
              label: "Edit your comment",
            }}
          />
          <Button className="w-full" disabled={isUpdateMessagePending}>
            {isUpdateMessagePending ? "Modifying..." : "Modify"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
