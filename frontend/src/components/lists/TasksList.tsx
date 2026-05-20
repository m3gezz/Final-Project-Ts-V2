import { Badge } from "@/components/ui/badge";
import TaskCard from "../cards/TaskCard";
import TaskCardSkeleton from "../skeletons/TaskCardSkeleton";
import type { PopulatedTask } from "@/assets/types";
import { Check, Circle, CircleDot } from "lucide-react";

export default function TasksList({
  tasks,
  isLoading,
}: {
  tasks: PopulatedTask[];
  isLoading: boolean;
}) {
  return [
    { key: "todo", label: "To do", icon: Circle },
    { key: "doing", label: "In progress", icon: CircleDot },
    { key: "done", label: "Done", icon: Check },
  ].map((c) => {
    const style =
      c?.key === "todo"
        ? "text-yellow-400 fill-yellow-400"
        : c?.key === "doing"
          ? "text-blue-400 fill-blue-400"
          : "text-green-400 fill-green-400";
    return (
      <div
        key={c.key}
        className="flex flex-col gap-3 rounded-xl border bg-muted/30 p-3"
      >
        <div className="flex items-center justify-between px-1 text-sm font-medium">
          <div className={`flex gap-2 items-center ${style}`}>
            <c.icon className={`w-4 h-4`} />
            <span>{c?.label}</span>
          </div>
          <Badge variant="secondary" className={style}>
            {tasks?.filter((t) => t?.status === c?.key)?.length ?? 0}
          </Badge>
        </div>
        <div className="space-y-2">
          {isLoading ? (
            <TaskCardSkeleton />
          ) : (
            tasks
              ?.filter((t) => t?.status === c?.key)
              ?.map((t) => <TaskCard key={t?.id} task={t} />)
          )}
        </div>
      </div>
    );
  });
}
