import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatTime, getImageUrl } from "@/lib/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import { Circle, CircleCheck, Timer, X } from "lucide-react";
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
  const isProjectOwner = user?.id === previous?.project?.user_id;

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

  const style =
    task?.status === "todo"
      ? "border-yellow-400/50"
      : task?.status === "doing"
        ? "border-blue-400/50"
        : "border-green-400/50";

  return (
    <article
      className={`cursor-pointer rounded-lg border bg-card p-3 ${style}`}
    >
      <ContextMenu>
        <ContextMenuTrigger>
          <div className="flex items-start justify-between">
            <div className="text-sm space-y-2">
              <h1
                className={`font-medium text-lg ${task?.status === "done" && "line-through decoration-2"}`}
              >
                {task?.title}
              </h1>
              {task?.description && (
                <p
                  className={`${task?.status === "done" && "line-through decoration-2"}`}
                >
                  {task?.description}
                </p>
              )}
            </div>
            <span className="text-xs text-muted-foreground">
              {formatTime(task?.created_at)}
            </span>
          </div>

          <Link
            to={`/users/${task?.user?.id}`}
            className="mt-6 flex items-center gap-2"
          >
            <Avatar className="h-6 w-6">
              <AvatarImage src={getImageUrl(task?.user?.avatar)} />
              <AvatarFallback>{task?.user?.full_name?.[0]}</AvatarFallback>
            </Avatar>
            <div className="truncate text-sm">
              {task?.user?.full_name}
              <p className="text-xs text-muted-foreground">@{user?.username}</p>
            </div>
          </Link>
        </ContextMenuTrigger>
        <ContextMenuContent>
          {(user?.id === task?.user?.id || isProjectOwner) && (
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
                  <Timer /> Set as in progress
                </ContextMenuItem>
              )}
              {task?.status !== "done" && (
                <ContextMenuItem
                  variant={"done"}
                  disabled={isUpdateTaskPending}
                  onClick={() => updateTaskMutation({ status: "done" })}
                >
                  <CircleCheck />
                  Set as done
                </ContextMenuItem>
              )}
            </>
          )}
          {isProjectOwner && (
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
    </article>
  );
}
