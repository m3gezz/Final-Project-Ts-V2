import type { TaskType } from "@/assets/types";
import { formatTime } from "@/lib/utils";
import FeedSkeleton from "../skeletons/FeedSkeleton";
import { Skeleton } from "../ui/skeleton";

export default function FeedList({
  tasks,
  isLoading,
}: {
  tasks: TaskType[];
  isLoading: boolean;
}) {
  return isLoading ? (
    <article className="p-4">
      <Skeleton className="h-8 w-48 mb-6" />
      <ul>
        {[...Array(3)].map((_, i) => {
          const calculatedOpacity = (4 - i) / 4;
          return <FeedSkeleton key={i} calculatedOpacity={calculatedOpacity} />;
        })}
      </ul>
    </article>
  ) : (
    <article className="p-4">
      <h1 className="text-2xl font-bold mb-4">Your activity feed</h1>
      <ul>
        {tasks?.length ? (
          tasks?.map((t: TaskType, i: number) => (
            <li
              key={t?.id}
              className="border-l pb-4"
              style={{
                opacity: (tasks?.length - i) / tasks?.length,
              }}
            >
              <div className="flex items-start gap-2">
                <div className="-ml-1 h-2 w-2 bg-primary rounded-full mt-2" />
                <div>
                  <h2>{t?.title}</h2>
                  <p className="italic text-xs truncate">{t?.description}</p>
                </div>
              </div>
              <span className="text-accent text-xs ml-4">
                {formatTime(t?.updated_at)}
              </span>
            </li>
          ))
        ) : (
          <li className="text-sm text-muted-foreground text-center my-2">
            No tasks yet.
          </li>
        )}
      </ul>
    </article>
  );
}
