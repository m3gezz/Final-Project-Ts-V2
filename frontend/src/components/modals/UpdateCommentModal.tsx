import type { CommentType } from "@/assets/types";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { Button } from "../ui/button";
import { useParams } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateComment } from "@/api/functions/projects";
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
import type { updateCommentSchemaType } from "@/zod/comments";
import TextareaController from "../controllers/TextareaController";

export default function UpdateCommentModal() {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const disp = useAppDispatch();
  const { value } = useAppSelector((state) => state?.modal);
  const { isUpdateComment } = useAppSelector((state) => state?.modal);
  const form = useForm<updateCommentSchemaType>({
    defaultValues: {
      content: "",
    },
  });

  useEffect(() => {
    form.reset({ content: value?.content });
  }, [value]);

  const { mutate: updateCommentMutation, isPending: isUpdateCommentPending } =
    useMutation({
      mutationFn: (data: updateCommentSchemaType) =>
        updateComment(value?.id, data),
      onMutate: (data) => {
        queryClient.cancelQueries();
        disp(toggleModal({ name: "isUpdateComment" }));
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
      open={isUpdateComment}
      onOpenChange={() => disp(toggleModal({ name: "isUpdateComment" }))}
    >
      <DialogContent
        aria-describedby=""
        className="rounded-2xl border bg-card p-8"
      >
        <DialogHeader>
          <DialogTitle>Edit Your Comment</DialogTitle>
          <DialogDescription>
            Make changes to your comment and save when you're ready.
          </DialogDescription>
        </DialogHeader>

        <form
          className="space-y-4"
          onSubmit={form.handleSubmit((data) => updateCommentMutation(data))}
        >
          <TextareaController
            control={form.control}
            f={{
              name: "content",
              type: "text",
              label: "Edit your comment",
            }}
            className="min-h-10"
          />
          <Button className="w-full" disabled={isUpdateCommentPending}>
            {isUpdateCommentPending ? "Modifying..." : "Modify"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
