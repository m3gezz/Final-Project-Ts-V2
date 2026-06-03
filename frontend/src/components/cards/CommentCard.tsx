import type { CommentType } from "@/assets/types";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { formatTime, getImageUrl } from "@/lib/utils";
import { useAppSelector } from "@/redux/store";
import { Button } from "../ui/button";
import { Check, Pen, X } from "lucide-react";
import { useParams } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { destroyComment, updateComment } from "@/api/functions/projects";
import { useState } from "react";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { Input } from "../ui/input";

export default function CommentCard({ comment }: { comment: CommentType }) {
  const { id } = useParams();
  const [edit, setEdit] = useState({
    editing: false,
    content: comment?.content,
  });
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

  const { mutate: updateCommentMutation, isPending: isUpdateCommentPending } =
    useMutation({
      mutationFn: () => updateComment(comment?.id, { content: edit?.content }),
      onMutate: () => {
        queryClient.cancelQueries();
        setEdit((prev) => ({ ...prev, editing: false }));
        const previous = queryClient.getQueryData([
          "project-comments",
          String(id),
        ]);
        queryClient.setQueryData(
          ["project-comments", String(id)],
          (old: CommentType[]) => [
            ...old?.map((c) => {
              if (c?.id == comment?.id) {
                return { ...c, content: edit?.content };
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
    <ContextMenu>
      <div className="flex gap-3">
        <Avatar className="h-8 w-8">
          <AvatarImage src={getImageUrl(comment?.user?.avatar)} />
          <AvatarFallback>{comment?.user?.full_name?.[0]}</AvatarFallback>
        </Avatar>

        {edit?.editing ? (
          <Input
            value={edit?.content}
            onChange={(e) =>
              setEdit((prev) => ({ ...prev, content: e?.target?.value }))
            }
            className="w-[80%] max-w-200 p-2 rounded border rounded-tr-none"
          />
        ) : (
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
        )}
        {user?.id === comment?.user?.id && (
          <ContextMenuContent>
            <ContextMenuItem
              onClick={() => setEdit((prev) => ({ ...prev, editing: true }))}
              variant={"done"}
            >
              <Pen /> Edit
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
        {edit?.editing && (
          <div className="flex items-center">
            <Button
              size={"icon-xs"}
              variant={"secondary"}
              onClick={() => setEdit((prev) => ({ ...prev, editing: false }))}
              className="mx-2"
            >
              <X />
            </Button>
            <Button
              size={"icon-xs"}
              variant={"secondary"}
              disabled={
                isUpdateCommentPending || edit?.content?.trim()?.length === 0
              }
              onClick={() => updateCommentMutation()}
              className="my-auto mx-2"
            >
              <Check />
            </Button>
          </div>
        )}
      </div>
    </ContextMenu>
  );
}
