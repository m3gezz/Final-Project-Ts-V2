import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getImageUrl } from "@/lib/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { X } from "lucide-react";
import type { PopulatedTask, PopulatedWorkspace } from "@/assets/types";
import { destroyTask, updateTask } from "@/api/functions/tasks";
import { useAppSelector } from "@/redux/store";

export default function TaskCard({ task }: { task: PopulatedTask }) {
  const { id } = useParams();
  const { user } = useAppSelector((state) => state?.auth);
  const queryClient = useQueryClient();
  const { mutate: updateTaskMutation, isPending: isUpdateTaskPending } =
    useMutation({
      mutationFn: (data: { status: "doing" | "done" }) =>
        updateTask(task?.id, data),
      onMutate: (data) => {
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

  const { mutate: removeTask, isPending: isRemoveTaskPending } = useMutation({
    mutationFn: () => destroyTask(task?.id),
    onMutate: () => {
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
    <div
      key={task?.id}
      className="rounded-lg border bg-card p-3 space-y-4"
      style={{ boxShadow: "var(--shadow-soft)" }}
    >
      <div className="flex items-center justify-between">
        <div className="text-sm">
          <h1 className="font-medium">{task?.title}</h1>
          {task?.description && <p>{task?.description}</p>}
        </div>
        {user?.id === task?.user?.id && task?.status === "todo" ? (
          <Button
            variant={"default"}
            disabled={isUpdateTaskPending}
            onClick={() => updateTaskMutation({ status: "doing" })}
          >
            I'll work on it
          </Button>
        ) : user?.id === task?.user?.id && task?.status === "doing" ? (
          <Button
            variant={"secondary"}
            disabled={isUpdateTaskPending}
            onClick={() => updateTaskMutation({ status: "done" })}
          >
            Done
          </Button>
        ) : (
          user?.id === task?.user?.id &&
          task?.status === "done" && (
            <Button
              variant={"destructive"}
              disabled={isRemoveTaskPending}
              onClick={() => removeTask()}
            >
              <X />
            </Button>
          )
        )}
      </div>
      <div className="mt-2 flex items-center justify-between">
        {task?.user && (
          <Avatar className="h-6 w-6">
            <AvatarImage src={getImageUrl(task?.user?.avatar)} />
            <AvatarFallback>{task?.user?.full_name?.[0]}</AvatarFallback>
          </Avatar>
        )}
      </div>
    </div>
  );
}
