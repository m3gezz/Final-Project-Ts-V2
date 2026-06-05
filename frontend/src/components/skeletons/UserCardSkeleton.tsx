import { Skeleton } from "../ui/skeleton";

export default function UserCardSkeleton() {
  return (
    <div className="flex gap-4 rounded-xl border bg-card p-5">
      <Skeleton className="h-14 w-14 rounded-full shrink-0" />

      <div className="min-w-0 flex-1 space-y-2">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-3 w-full mt-1" />

        <div className="mt-2 flex flex-wrap gap-1 pt-1">
          <Skeleton className="h-4 w-14 rounded-full" />
          <Skeleton className="h-4 w-16 rounded-full" />
          <Skeleton className="h-4 w-12 rounded-full" />
        </div>
      </div>
    </div>
  );
}
