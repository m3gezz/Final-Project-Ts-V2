import { Skeleton } from "../ui/skeleton";
import ProjectCardSkeleton from "./ProjectCardSkeleton";

export default function UserSkeleton() {
  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <div className="rounded-2xl border bg-card p-8">
        <div className="flex flex-wrap flex-col md:flex-row items-start gap-6">
          <Skeleton className="h-24 w-24 rounded-full shrink-0" />

          <div className="flex-1 min-w-0 space-y-3 w-full">
            <Skeleton className="h-7 w-48" />
            <Skeleton className="h-4 w-24" />

            <div className="space-y-1.5 pt-1">
              <Skeleton className="h-4 w-full max-w-xl" />
              <Skeleton className="h-4 w-4/5" />
            </div>

            <div className="mt-4 flex flex-wrap gap-1.5 pt-2">
              <Skeleton className="h-5 w-16 rounded-full" />
              <Skeleton className="h-5 w-20 rounded-full" />
              <Skeleton className="h-5 w-14 rounded-full" />
            </div>
          </div>

          <Skeleton className="h-10 w-28 shrink-0 hidden md:block" />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="rounded-xl border bg-card p-6 md:col-span-2 space-y-3">
          <Skeleton className="h-6 w-20" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>

        <div className="rounded-xl border bg-card p-6 space-y-3">
          <Skeleton className="h-6 w-24" />

          <div className="mt-3 space-y-2">
            {[...Array(2)].map((_, i) => (
              <div
                key={i}
                className="flex items-center gap-3 rounded-lg border bg-muted/20 p-3"
              >
                <Skeleton className="h-6 w-6 rounded-md" />
                <Skeleton className="h-4 w-32 flex-1" />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-col space-y-6">
        <div className="flex gap-2">
          <Skeleton className="h-9 w-28 rounded-md" />
          <Skeleton className="h-9 w-28 rounded-md" />
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(4)].map((_, i) => (
            <ProjectCardSkeleton key={i} />
          ))}
        </div>

        <Skeleton className="h-4 w-52 mx-auto" />
      </div>
    </div>
  );
}
