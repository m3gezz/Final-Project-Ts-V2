import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import CreateTaskModal from "@/components/modals/CreateTaskModal";
import { useQuery } from "@tanstack/react-query";
import { getWorkspace } from "@/api/functions/workspace";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import TasksList from "@/components/lists/TasksList";

export default function WorkspaceTasks() {
  const { id } = useParams();
  const { user } = useSelector((state) => state?.auth);
  const { data: workspace, isLoading } = useQuery({
    queryKey: ["workspace", id, "tasks"],
    queryFn: () => getWorkspace(id, "tasks"),
  });

  const isAdmin = workspace?.memberships?.find(
    (m) =>
      m?.user_id === user?.id && (m?.role === "admin" || m?.role === "owner"),
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Tasks</h1>
        <Dialog>
          {isAdmin && (
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                New task
              </Button>
            </DialogTrigger>
          )}
          <CreateTaskModal />
        </Dialog>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <TasksList tasks={workspace?.tasks} isLoading={isLoading} />
      </div>
    </div>
  );
}
