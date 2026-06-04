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
import InputController from "../controllers/InputController";
import { toggleModal } from "@/redux/modalSlice";
import { useEffect } from "react";

export default function UpdateCommentModal() {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const disp = useAppDispatch();
  const { value } = useAppSelector((state) => state?.modal);
  const { isUpdateComment } = useAppSelector((state) => state?.modal);
  const form = useForm({
    defaultValues: {
      content: "",
    },
  });

  useEffect(() => {
    form.reset({ content: value?.content });
  }, [value]);

  const { mutate: updateCommentMutation, isPending: isUpdateCommentPending } =
    useMutation({
      mutationFn: (data) => updateComment(value?.id, data),
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
          <DialogTitle>Edit your comment</DialogTitle>
          <DialogDescription>
            Continuing means that your comment will be changed, and marked as
            so.
          </DialogDescription>
        </DialogHeader>

        <form
          className="space-y-4"
          onSubmit={form.handleSubmit((data) => updateCommentMutation(data))}
        >
          <InputController
            control={form.control}
            f={{
              name: "content",
              type: "text",
              label: "Edit your comment",
            }}
          />
          <Button className="w-full" disabled={isUpdateCommentPending}>
            {isUpdateCommentPending ? "Modifying..." : "Modify"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
