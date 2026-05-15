import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogTitle,
  DialogFooter,
  DialogHeader,
} from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import InputController from "../controllers/InputController";
import TextareaController from "../controllers/TextareaController";
import SelectController from "../controllers/SelectController";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTask } from "@/api/functions/tasks";

export default function CreateTaskModal() {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const data = queryClient.getQueryData(["workspace", String(id), "tasks"]);
  const members = data?.memberships?.map((m) => ({
    id: m?.user?.id,
    label: m?.user?.full_name,
  }));
  const form = useForm({
    defaultValues: {
      workspace_id: id,
      title: "",
      description: "",
      user_id: "",
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (data) => createTask(data),
    onMutate: (data) => {
      const previousProject = queryClient.getQueryData([
        "workspace",
        String(id),
        "tasks",
      ]);
      queryClient.setQueryData(["workspace", String(id), "tasks"], (old) => ({
        ...old,
        tasks: [
          ...old.tasks,
          {
            id: Date.now(),
            status: "todo",
            title: data?.title,
            description: data?.description,
            user: old.memberships.find((m) => m?.user?.id == data?.user_id)
              ?.user,
          },
        ],
      }));
      return { previousProject };
    },
    onError: (err) => {
      const res = err.response;
      if (res.status !== 422) return alert("error");

      const errors = res.data.errors;
      for (const key in errors) {
        form.setError(key, { message: errors[key] });
      }
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
    <DialogContent aria-describedby="">
      <DialogHeader>
        <DialogTitle>Create task</DialogTitle>
      </DialogHeader>
      <form
        className="space-y-3"
        onSubmit={form.handleSubmit((data) => mutate(data))}
      >
        <InputController
          control={form.control}
          f={{
            name: "title",
            label: "Title",
            placeholder: "Task title",
          }}
        />
        <TextareaController
          control={form.control}
          f={{
            name: "description",
            label: "Description",
            placeholder: "Description (optional)",
          }}
        />
        <SelectController
          control={form.control}
          f={{
            name: "user_id",
            placeholder: "Task title",
          }}
          options={members}
        />
        <DialogFooter>
          <Button disabled={isPending}>Create</Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}
