import { Badge } from "@/components/ui/badge";
import TaskCard from "../cards/TaskCard";
import TaskCardSkeleton from "../skeletons/TaskCardSkeleton";
import type { PopulatedTask } from "@/assets/types";
import { Circle, CircleCheck, Loader2, Timer } from "lucide-react";
import NoContentCard from "../cards/NoContentCard";

export default function TasksList({
  tasks,
  isLoading,
}: {
  tasks: PopulatedTask[];
  isLoading: boolean;
}) {
  return [
    { key: "todo", label: "To do", icon: Circle },
    { key: "doing", label: "In progress", icon: Timer },
    { key: "done", label: "Done", icon: CircleCheck },
  ].map((c) => {
    const style =
      c?.key === "todo"
        ? "text-yellow-400 fill-yellow-400"
        : c?.key === "doing"
          ? "text-blue-400 fill-blue-400"
          : "text-green-400 fill-green-400";
    return (
      <section key={c.key} className="flex flex-col gap-3">
        <div className="flex items-center justify-between text-sm font-medium bg-muted rounded-xl p-3">
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
          ) : tasks?.length ? (
            tasks
              ?.filter((t) => t?.status === c?.key)
              ?.map((t) => <TaskCard key={t?.id} task={t} />)
          ) : (
            <NoContentCard
              icon={c?.icon}
              title={`No ${c?.label.toLocaleLowerCase()} tasks yet`}
              description={`Tasks with status ${c?.label.toLocaleLowerCase()} will appear here.`}
            />
          )}
        </div>
      </section>
    );
  });
}
