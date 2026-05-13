import { deleteProject } from "@/api/functions/project";
import { Button } from "@/components/ui/button";
import { DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

export default function DeleteProjectModal({ id }: { id: string }) {
  const nav = useNavigate();
  const { mutate, isPending } = useMutation({
    mutationFn: () => deleteProject(id),
    onSuccess: () => {
      nav("/projects");
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
          <h1 className="text-2xl text-destructive font-semibold tracking-tight">
            Delete Project
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Just to make sure, this action will delete this project and all its
            data, are you really sure ?
          </p>
        </div>
      </DialogTitle>
      <form className="space-y-4">
        <Button
          type="button"
          onClick={() => mutate()}
          variant={"destructive"}
          className="w-full"
          disabled={isPending}
        >
          {isPending ? "Deleting..." : "Delete"}
        </Button>
      </form>
    </DialogContent>
  );
}
