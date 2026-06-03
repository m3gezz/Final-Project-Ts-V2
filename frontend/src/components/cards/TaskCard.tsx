import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatTime, getImageUrl } from "@/lib/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import { Check, Circle, CircleDot, X } from "lucide-react";
import type { PopulatedTask, PopulatedWorkspace } from "@/assets/types";
import { destroyTask, updateTask } from "@/api/functions/tasks";
import { useAppSelector } from "@/redux/store";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";

export default function TaskCard({ task }: { task: PopulatedTask }) {
  const { id } = useParams();
  const { user } = useAppSelector((state) => state?.auth);
  const queryClient = useQueryClient();
  const previous: PopulatedWorkspace | undefined = queryClient.getQueryData([
    "workspace",
    String(id),
    "tasks",
  ]);
  const isOwner = user?.id === previous?.project?.user_id;

  const { mutate: updateTaskMutation, isPending: isUpdateTaskPending } =
    useMutation({
      mutationFn: (data: { status: "todo" | "doing" | "done" }) =>
        updateTask(task?.id, data),
      onMutate: (data) => {
        queryClient.cancelQueries();
        const previousProject = queryClient.getQueryData([
          "workspace",
          String(id),
          "tasks",
        ]);
        queryClient.setQueryData(
          ["workspace", String(id), "tasks"],
          (old: PopulatedWorkspace) => ({
            ...old,
            tasks: [
              ...old?.tasks?.map((t) => {
                if (t?.id == task?.id) {
                  t = { ...t, ...data };
                }
                return t;
              }),
            ],
          }),
        );
        return { previousProject };
      },
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["workspace", String(id), "tasks"],
        });
        queryClient.invalidateQueries({
          queryKey: ["workspace", String(id), "overview"],
        });
      },
    });

  const { mutate: destroyTaskMutation, isPending: isDestroyTaskPending } =
    useMutation({
      mutationFn: () => destroyTask(task?.id),
      onMutate: () => {
        queryClient.cancelQueries();
        const previousProject = queryClient.getQueryData([
          "workspace",
          String(id),
          "tasks",
        ]);
        queryClient.setQueryData(
          ["workspace", String(id), "tasks"],
          (old: PopulatedWorkspace) => ({
            ...old,
            tasks: [...old?.tasks?.filter((t) => t?.id != task?.id)],
          }),
        );
        return { previousProject };
      },
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["workspace", String(id), "tasks"],
        });
        queryClient.invalidateQueries({
          queryKey: ["workspace", String(id), "overview"],
        });
      },
    });

  return (
    <div key={task?.id} className="rounded-lg border bg-card p-3 space-y-6">
      <ContextMenu>
        <ContextMenuTrigger>
          <div className="flex items-center justify-between">
            <div className="text-sm">
              <h1 className="font-medium text-xl">{task?.title}</h1>
              {task?.description && <p>{task?.description}</p>}
            </div>
            <span className="text-xs text-muted-foreground">
              {formatTime(task?.created_at)}
            </span>
          </div>
          <div className="mt-2 flex items-center gap-2">
            <Avatar className="h-6 w-6">
              <AvatarImage src={getImageUrl(task?.user?.avatar)} />
              <AvatarFallback>{task?.user?.full_name?.[0]}</AvatarFallback>
            </Avatar>
            <div className="truncate">
              <Link to={`/users/${task?.user?.id}`} className="font-medium ">
                {task?.user?.full_name}
              </Link>
              <p className="text-xs text-muted-foreground">@{user?.username}</p>
            </div>
          </div>
        </ContextMenuTrigger>
        <ContextMenuContent>
          {(user?.id === task?.user?.id || isOwner) && (
            <>
              {task?.status !== "todo" && (
                <ContextMenuItem
                  variant={"todo"}
                  disabled={isUpdateTaskPending}
                  onClick={() => updateTaskMutation({ status: "todo" })}
                >
                  <Circle />
                  Set as todo
                </ContextMenuItem>
              )}
              {task?.status !== "doing" && (
                <ContextMenuItem
                  variant={"doing"}
                  disabled={isUpdateTaskPending}
                  onClick={() => updateTaskMutation({ status: "doing" })}
                >
                  <CircleDot /> Set as in progress
                </ContextMenuItem>
              )}
              {task?.status !== "done" && (
                <ContextMenuItem
                  variant={"done"}
                  disabled={isUpdateTaskPending}
                  onClick={() => updateTaskMutation({ status: "done" })}
                >
                  <Check />
                  Set as done
                </ContextMenuItem>
              )}
            </>
          )}
          {isOwner && (
            <ContextMenuItem
              variant={"destructive"}
              disabled={isDestroyTaskPending}
              onClick={() => destroyTaskMutation()}
            >
              <X /> Delete
            </ContextMenuItem>
          )}
        </ContextMenuContent>
      </ContextMenu>
    </div>
  );
}
