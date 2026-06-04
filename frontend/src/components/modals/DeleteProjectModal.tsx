import { destroyProject } from "@/api/functions/projects";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useMutation } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";

export default function DeleteProjectModal() {
  const { id } = useParams();
  const nav = useNavigate();
  const { mutate: destroyProjectMutation, isPending: isDestroyProjectPending } =
    useMutation({
      mutationFn: () => destroyProject(id),
      onSuccess: () => {
        nav("/projects");
      },
    });

  return (
    <Dialog>
      <DialogContent
        aria-describedby=""
        className="rounded-2xl border bg-card p-8"
      >
        <DialogHeader>
          <DialogTitle>Delete Project</DialogTitle>
          <DialogDescription>
            Just to make sure, this action will delete this project and all its
            data, are you really sure ?
          </DialogDescription>
        </DialogHeader>
        <form className="space-y-4">
          <Button
            type="button"
            onClick={() => destroyProjectMutation()}
            variant={"destructive"}
            className="w-full"
            disabled={isDestroyProjectPending}
          >
            {isDestroyProjectPending ? "Deleting..." : "Delete"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
