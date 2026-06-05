import { Button } from "@/components/ui/button";
import { List, Plus } from "lucide-react";
import CreateTaskModal from "@/components/modals/CreateTaskModal";
import { useQuery } from "@tanstack/react-query";
import { getWorkspace } from "@/api/functions/workspaces";
import { useParams } from "react-router-dom";
import TasksList from "@/components/lists/TasksList";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import type { MembershipType } from "@/assets/types";
import { toggleModal } from "@/redux/modalSlice";

export default function WorkspaceTasks() {
  const { id } = useParams();
  const disp = useAppDispatch();
  const { user } = useAppSelector((state) => state?.auth);
  const { data: workspace, isLoading } = useQuery({
    queryKey: ["workspace", id, "tasks"],
    queryFn: () => getWorkspace(id, "tasks"),
  });

  const isAdmin = workspace?.memberships?.find(
    (m: MembershipType) =>
      m?.user_id === user?.id && (m?.role === "admin" || m?.role === "owner"),
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight flex items-center gap-2">
          <List className="h-6 w-6" /> Tasks
        </h1>
        {isAdmin && (
          <Button onClick={() => disp(toggleModal({ name: "isCreateTask" }))}>
            <Plus className="mr-2 h-4 w-4" />
            New task
          </Button>
        )}
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <TasksList tasks={workspace?.tasks} isLoading={isLoading} />
      </div>
      <CreateTaskModal />
    </div>
  );
}
