import { Skeleton } from "../ui/skeleton";
import ProjectCardSkeleton from "./ProjectCardSkeleton";

export default function UserSkeleton() {
  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="flex flex-wrap items-start gap-6 p-8 border rounded-xl">
        <Skeleton className="h-24 w-24 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-4 w-30" />
          <Skeleton className="h-4 w-50" />
          <div className="mt-4 flex flex-wrap gap-1.5">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-3 w-12" />
            ))}
          </div>
        </div>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        <div className="rounded-xl md:col-span-2 space-y-2 p-4 border">
          <Skeleton className="h-5 w-30" />
          <Skeleton className="h-20 w-full" />
        </div>
        <div className="border rounded-xl space-y-2 p-4">
          <Skeleton className="h-5 w-30" />
          <Skeleton className="h-20 w-full" />
        </div>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(2)].map((_, i) => (
          <ProjectCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
