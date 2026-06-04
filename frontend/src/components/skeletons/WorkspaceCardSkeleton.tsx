import { Skeleton } from "../ui/skeleton";

export default function WorkspaceCardSkeleton() {
  return (
    <article className="flex flex-col justify-between gap-4 rounded-xl border bg-card p-4">
      <div className="flex items-start justify-between">
        <Skeleton className="w-12 h-12 rounded-md" />
        <Skeleton className="h-5 w-20 rounded-full" />
      </div>

      <div className="space-y-2">
        <Skeleton className="h-5 w-3/4" />
        <div className="space-y-1">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </div>
      </div>

      <div className="my-1 space-y-2">
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-8" />
        </div>
        <Skeleton className="h-2 w-full rounded-full" />
      </div>

      <div className="flex items-center justify-between">
        <div className="flex -space-x-2">
          {[...Array(3)].map((_, i) => (
            <Skeleton
              key={i}
              className="h-6 w-6 rounded-full ring-2 ring-card"
            />
          ))}
        </div>
        <Skeleton className="h-4 w-28" />
      </div>
    </article>
  );
}
