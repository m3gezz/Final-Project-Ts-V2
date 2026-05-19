import type { CommentType } from "@/assets/types";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { formatTime, getImageUrl } from "@/lib/utils";
import { useAppSelector } from "@/redux/store";
import { Button } from "../ui/button";
import { X } from "lucide-react";
import { useParams } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { destroyComment } from "@/api/functions/projects";

export default function CommentCard({ comment }: { comment: CommentType }) {
  const { id } = useParams();
  const queryClient = useQueryClient();
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
      <div className="relative flex-1 rounded-lg bg-muted/50 p-3">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium">{comment?.user?.full_name}</span>
          <span className="text-xs text-muted-foreground">
            {formatTime(comment?.created_at)}
          </span>
        </div>
        <p className="mt-1 text-sm">{comment?.content}</p>
        {user?.id === comment?.user?.id && (
          <Button
            variant={"destructive"}
            size={"icon-xs"}
            className="absolute -top-2 -right-2"
            disabled={isDestroyCommentPending}
            onClick={() => destroyCommentMutation()}
          >
            <X />
          </Button>
        )}
      </div>
    </div>
  );
}
