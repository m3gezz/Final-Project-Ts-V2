import { Skeleton } from "../ui/skeleton";

export default function ReceivedRequestCardSkeleton() {
  return (
    <div className="flex flex-wrap items-center gap-4 rounded-xl border bg-card p-4">
      <Skeleton className="h-10 w-10 rounded-full shrink-0" />

      <div className="flex-1 min-w-0 space-y-2">
        <div className="space-y-1">
          <Skeleton className="h-4 w-full max-w-70" />
          <Skeleton className="h-4 w-1/2 max-w-37" />
        </div>
        <div className="flex items-center gap-2 pt-0.5">
          <Skeleton className="h-5 w-16 rounded-md" />
          <Skeleton className="h-3 w-12" />
        </div>
      </div>

      <div className="flex gap-2 shrink-0 ml-auto md:ml-0">
        <Skeleton className="h-9 w-20 rounded-md" />
        <Skeleton className="h-9 w-20 rounded-md" />
      </div>
    </div>
  );
}
