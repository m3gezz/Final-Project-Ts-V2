import { Badge } from "@/components/ui/badge";
import TaskCard from "../cards/TaskCard";
import TaskCardSkeleton from "../skeletons/TaskCardSkeleton";
import type { PopulatedTask } from "@/assets/types";

export default function TasksList({
  tasks,
  isLoading,
}: {
  tasks: PopulatedTask[];
  isLoading: boolean;
}) {
  return [
    { key: "todo", label: "To do" },
    { key: "doing", label: "In progress" },
    { key: "done", label: "Done" },
  ].map((c) => (
    <div
      key={c.key}
      className="flex flex-col gap-3 rounded-xl border bg-muted/30 p-3"
    >
      <div className="flex items-center justify-between px-1 text-sm font-medium">
        <span>{c.label}</span>
        <Badge variant="secondary">
          {tasks?.filter((t) => t?.status === c?.key)?.length ?? 0}
        </Badge>
      </div>
      <div className="space-y-2">
        {isLoading ? (
          <TaskCardSkeleton />
        ) : (
          tasks
            ?.filter((t) => t?.status === c.key)
            ?.map((t) => <TaskCard key={t?.id} task={t} />)
        )}
      </div>
    </div>
  ));
}
