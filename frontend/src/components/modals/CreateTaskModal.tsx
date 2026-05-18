import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogTitle,
  DialogFooter,
  DialogHeader,
  DialogDescription,
} from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import InputController from "../controllers/InputController";
import TextareaController from "../controllers/TextareaController";
import SelectController from "../controllers/SelectController";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTask } from "@/api/functions/tasks";
import type { PopulatedWorkspace } from "@/assets/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { createTaskSchema, type createTaskSchemaType } from "@/zod/taskSchemas";
import { handleApiErrors } from "@/api/functions/validation";

export default function CreateTaskModal() {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const data: PopulatedWorkspace | undefined = queryClient.getQueryData([
    "workspace",
    String(id),
    "tasks",
  ]);
  const members = data?.memberships?.map((m) => ({
    id: m?.user?.id,
    label: m?.user?.full_name,
  }));
  const form = useForm<createTaskSchemaType>({
    defaultValues: {
      workspace_id: String(id),
      title: "",
      description: "",
      user_id: "",
    },
    resolver: zodResolver(createTaskSchema),
  });

  const { mutate: createTaskMutation, isPending: isCreateTaskPending } =
    useMutation({
      mutationFn: (data: createTaskSchemaType) => createTask(data),
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
              ...old?.tasks,
              {
                id: Date.now(),
                status: "todo",
                title: data?.title,
                description: data?.description,
                user: old.memberships.find((m) => m?.user?.id == data?.user_id)
                  ?.user,
              },
            ],
          }),
        );
        return { previousProject };
      },
      onError: (err) => {
        handleApiErrors(err, form);
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
        <DialogDescription>
          Fill the bottom fields to create a new task.
        </DialogDescription>
      </DialogHeader>
      <form
        className="space-y-3"
        onSubmit={form.handleSubmit((data) => createTaskMutation(data))}
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
          }}
          options={members}
        />
        <DialogFooter>
          <Button disabled={isCreateTaskPending}>
            {isCreateTaskPending ? "Creating..." : "Create"}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}
