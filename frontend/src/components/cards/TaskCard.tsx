import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getImageUrl } from "@/lib/utils";
import { useSelector } from "react-redux";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { deleteTask, modifyTask } from "@/api/functions/tasks";
import { X } from "lucide-react";

export default function TaskCard({ task }) {
  const { id } = useParams();
  const { user } = useSelector((state) => state?.auth);
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: (data) => modifyTask(task?.id, data),
    onMutate: (data) => {
      const previousProject = queryClient.getQueryData([
        "workspace",
        String(id),
        "tasks",
      ]);
      queryClient.setQueryData(["workspace", String(id), "tasks"], (old) => ({
        ...old,
        tasks: [
          ...old.tasks.map((t) => {
            if (t?.id == task?.id) {
              t = { ...t, ...data };
            }
            return t;
          }),
        ],
      }));
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

  const { mutate: removeTask } = useMutation({
    mutationFn: () => deleteTask(id),
    onMutate: () => {
      const previousProject = queryClient.getQueryData([
        "workspace",
        String(id),
        "tasks",
      ]);
      queryClient.setQueryData(["workspace", String(id), "tasks"], (old) => ({
        ...old,
        tasks: [...old.tasks.filter((t) => t?.id != task?.id)],
      }));
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
            onClick={() => mutate({ status: "doing" })}
          >
            I'll work on it
          </Button>
        ) : task?.status === "doing" ? (
          <Button
            variant={"secondary"}
            onClick={() => mutate({ status: "done" })}
          >
            Done
          </Button>
        ) : (
          <Button variant={"destructive"} onClick={() => removeTask()}>
            <X />
          </Button>
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
