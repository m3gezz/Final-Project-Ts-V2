import type { CommentType } from "@/assets/types";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { Button } from "../ui/button";
import { useParams } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createMessage } from "@/api/functions/messages";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { toggleModal } from "@/redux/modalSlice";
import TextareaController from "../controllers/TextareaController";
import type { createFileMessageSchemaType } from "@/zod/messagesSchemas";
import { Paperclip, Send } from "lucide-react";
import { useRef } from "react";

export default function CreateFileMessageModal() {
  const { id } = useParams();
  const fileRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();
  const disp = useAppDispatch();
  const { value } = useAppSelector((state) => state?.modal);
  const { isCreateFileMessage } = useAppSelector((state) => state?.modal);
  const form = useForm<createFileMessageSchemaType>({
    defaultValues: {
      message: "",
      file: undefined,
      type: "file",
      workspace_id: String(id),
    },
  });

  const { mutate: createFileMessage, isPending: isCreateFileMessagePending } =
    useMutation({
      mutationFn: (data: createFileMessageSchemaType) => createMessage(data),
      onMutate: (data) => {
        queryClient.cancelQueries();
        disp(toggleModal({ name: "isCreateFileMessage" }));
        const previous = queryClient.getQueryData([
          "project-comments",
          String(id),
        ]);
        queryClient.setQueryData(
          ["project-comments", String(id)],
          (old: CommentType[]) => [
            ...old?.map((c) => {
              if (c?.id == value?.id) {
                return { ...c, ...data };
              }
              return c;
            }),
          ],
        );

        return { previous };
      },
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["project-comments", String(id)],
        });
      },
    });
  return (
    <Dialog
      open={isCreateFileMessage}
      onOpenChange={() => disp(toggleModal({ name: "isCreateFileMessage" }))}
    >
      <DialogContent
        aria-describedby=""
        className="rounded-2xl border bg-card p-8"
      >
        <DialogHeader>
          <DialogTitle>Select a File</DialogTitle>
          <DialogDescription>
            Choose a file to upload and share with your team.
          </DialogDescription>
        </DialogHeader>

        <form
          className="flex items-end gap-4"
          onSubmit={form.handleSubmit((data) => createFileMessage(data))}
        >
          <Button
            type="button"
            disabled={isCreateFileMessagePending}
            onClick={() => fileRef.current?.click()}
          >
            <Paperclip />
          </Button>
          <div className="w-full">
            <TextareaController
              control={form.control}
              f={{
                name: "message",
              }}
              className="min-h-10"
            />
          </div>
          <Button disabled={isCreateFileMessagePending}>
            <Send />
          </Button>

          <input
            ref={fileRef}
            type="file"
            className="hidden"
            accept="*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              form.setValue("file", file);
            }}
          />
        </form>
      </DialogContent>
    </Dialog>
  );
}
