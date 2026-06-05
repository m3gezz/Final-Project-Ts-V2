import { Skeleton } from "../ui/skeleton";

export default function TaskCardSkeleton() {
  return (
    <div className="rounded-lg border bg-card p-3 space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2 flex-1 min-w-0">
          <Skeleton className="h-6 w-3/4" />
          <div className="space-y-1">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
          </div>
        </div>
        <Skeleton className="h-3 w-12 shrink-0 mt-1" />
      </div>

      <div className="flex items-center gap-2 pt-1">
        <Skeleton className="h-6 w-6 rounded-full shrink-0" />
        <div className="space-y-1 flex-1 min-w-0">
          <Skeleton className="h-3.5 w-24" />
          <Skeleton className="h-3 w-16" />
        </div>
      </div>
    </div>
  );
}
