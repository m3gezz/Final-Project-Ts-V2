import type { CommentType } from "@/assets/types";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { formatTime, getImageUrl, handleCopy } from "@/lib/utils";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { Copy, Pen, TriangleAlert, X } from "lucide-react";
import { useParams } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { destroyComment } from "@/api/functions/projects";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { toast } from "sonner";
import { setValue, toggleModal } from "@/redux/modalSlice";

export default function CommentCard({ comment }: { comment: CommentType }) {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const disp = useAppDispatch();
  const { user } = useAppSelector((state) => state?.auth);

  const { mutate: destroyCommentMutation, isPending: isDestroyCommentPending } =
    useMutation({
      mutationFn: () => destroyComment(comment?.id),
      onMutate: () => {
        queryClient.cancelQueries();
        const previousProject = queryClient.getQueryData([
          "project-comments",
          String(id),
        ]);
        queryClient.setQueryData(
          ["project-comments", String(id)],
          (old: CommentType[]) => [...old?.filter((c) => c?.id != comment?.id)],
        );
        return { previousProject };
      },
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["project-comments", String(id)],
        });
      },
    });

  return (
    <div className="flex gap-3">
      <Avatar className="h-8 w-8">
        <AvatarImage src={getImageUrl(comment?.user?.avatar)} />
        <AvatarFallback>{comment?.user?.full_name?.[0]}</AvatarFallback>
      </Avatar>
      <ContextMenu>
        <ContextMenuTrigger className="relative flex-1 rounded-lg bg-muted/50 p-3">
          <div className="flex items-center justify-between text-sm">
            <div>
              <span className="font-medium">{comment?.user?.full_name}</span>
              <span className="text-xs text-muted-foreground">
                {comment?.updated_at != comment?.created_at && " edited"}
              </span>
            </div>
            <span className="text-xs text-muted-foreground">
              {formatTime(comment?.created_at)}
            </span>
          </div>
          <p className="mt-2">{comment?.content}</p>
        </ContextMenuTrigger>
        {user?.id === comment?.user?.id && (
          <ContextMenuContent>
            <ContextMenuItem onClick={() => handleCopy(comment?.content)}>
              <Copy /> Copy
            </ContextMenuItem>
            <ContextMenuItem
              variant="doing"
              onClick={() => {
                disp(toggleModal({ name: "isUpdateComment" }));
                disp(setValue({ value: comment }));
              }}
            >
              <Pen /> Edit
            </ContextMenuItem>
            <ContextMenuItem
              variant="todo"
              onClick={() => {
                toast.success("Thanks for your feed back");
              }}
            >
              <TriangleAlert /> Report
            </ContextMenuItem>
            <ContextMenuItem
              disabled={isDestroyCommentPending}
              onClick={() => destroyCommentMutation()}
              variant={"destructive"}
            >
              <X /> Delete
            </ContextMenuItem>
          </ContextMenuContent>
        )}
      </ContextMenu>
    </div>
  );
}
