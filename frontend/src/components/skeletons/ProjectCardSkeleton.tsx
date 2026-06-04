import { Skeleton } from "../ui/skeleton";

export default function ProjectCardSkeleton() {
  return (
    <article className="flex flex-col overflow-hidden rounded-xl border bg-card">
      <div className="relative aspect-video w-full bg-muted">
        <Skeleton className="absolute left-3 top-3 h-5 w-16 rounded-full" />
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="space-y-2">
          <Skeleton className="h-5 w-4/5" />
          <div className="space-y-1">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        </div>

        <div className="mt-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Skeleton className="h-6 w-6 rounded-full" />
            <Skeleton className="h-3 w-20" />
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <Skeleton className="h-3.5 w-3.5 rounded" />
              <Skeleton className="h-3 w-4" />
            </div>
            <div className="flex items-center gap-1">
              <Skeleton className="h-3.5 w-3.5 rounded" />
              <Skeleton className="h-3 w-4" />
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
