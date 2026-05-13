import { Skeleton } from "../ui/skeleton";

export default function ProjectSkeleton() {
  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="rounded-2xl border ">
        <Skeleton className="aspect-21/9" />
        <div className="space-y-2 p-4">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-8 w-40" />
          <div className="flex items-center gap-2">
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-3 w-40" />
          </div>
        </div>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        <div className="rounded-2xl md:col-span-2 space-y-2 border p-4">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-20 w-full" />
        </div>
        <div className="rounded-2xl space-y-2 border p-4">
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-20 w-full" />
        </div>
      </div>
    </div>
  );
}
