import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import TextareaController from "../controllers/TextareaController";
import { requestJoin } from "@/api/functions/inbox";
import { useNavigate } from "react-router-dom";

export default function SendRequestModal({ project_id }) {
  const form = useForm({
    defaultValues: {
      project_id,
      message: "Hi may i join ?",
    },
  });
  const nav = useNavigate();
  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn: (data) => requestJoin(data),
    onMutate: () => {
      const previousProject = queryClient.getQueryData([
        "project",
        String(project_id),
      ]);

      queryClient.setQueryData(["project", String(project_id)], (old) => ({
        ...old,
        isRequested: true,
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
        queryKey: ["project", String(project_id)],
      });
      nav(`/projects/${project_id}`);
    },
  });

  return (
    <DialogContent
      aria-describedby=""
      className="rounded-2xl border bg-card p-8"
      style={{ boxShadow: "var(--shadow-elegant)" }}
    >
      <DialogTitle>
        <div className="mb-6 text-center">
          <h1 className="text-2xl text-primary font-semibold tracking-tight">
            Ask to join
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Describe your skills and intentions to join.
          </p>
        </div>
      </DialogTitle>
      <form className="space-y-4">
        <TextareaController
          control={form.control}
          f={{
            name: "message",
          }}
        />
        <Button
          type="button"
          onClick={form.handleSubmit((data) => mutate(data))}
          className="w-full"
          disabled={isPending}
        >
          {isPending ? "Sending..." : "Send"}
        </Button>
      </form>
    </DialogContent>
  );
}
