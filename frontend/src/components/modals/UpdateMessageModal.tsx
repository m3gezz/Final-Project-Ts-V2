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
import { toggleModal } from "@/redux/modalSlice";
import { useEffect } from "react";
import { updateMessage } from "@/api/functions/messages";
import type { updateMessageSchemaType } from "@/zod/messagesSchemas";
import TextareaController from "../controllers/TextareaController";
import { File } from "lucide-react";
import { getImageUrl } from "@/lib/utils";

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
          <DialogTitle>Edit Message</DialogTitle>

          <DialogDescription>
            Update your message below. Edited messages will be marked as edited.
          </DialogDescription>
        </DialogHeader>

        {!!value?.attachment && (
          <section className="flex flex-col items-center justify-center gap-2">
            <div className="aspect-video w-full flex flex-col gap-2 items-center justify-center rounded-md overflow-clip">
              {value?.attachment?.file_type === "image" && (
                <img
                  src={getImageUrl(value?.attachment?.file_path)}
                  className="w-full h-full object-cover"
                />
              )}

              {value?.attachment?.file_type === "video" && (
                <video
                  controls
                  src={getImageUrl(value?.attachment?.file_path)}
                  className="w-full h-full object-cover"
                />
              )}
              {value?.attachment?.file_type === "document" && (
                <div className="bg-border h-1/2 w-1/2 rounded-lg flex items-center gap-4 py-2 px-4">
                  <File className="w-6 h-6" />
                  <div>
                    <h1>size: {value?.attachment?.file_size}Kb</h1>
                  </div>
                </div>
              )}
              {value?.attachment?.file_name && (
                <p className="italic text-xs truncate mt-1 text-foreground">
                  {value?.attachment?.file_name}
                </p>
              )}
            </div>
          </section>
        )}

        <form
          className="space-y-4"
          onSubmit={form.handleSubmit((data) => updateMessageMutation(data))}
        >
          <TextareaController
            control={form.control}
            f={{
              name: "message",
              type: "text",
              placeholder: "Edit your message",
            }}
            className="min-h-10"
          />
          <Button className="w-full" disabled={isUpdateMessagePending}>
            {isUpdateMessagePending ? "Modifying..." : "Modify"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
