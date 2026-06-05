import { Skeleton } from "../ui/skeleton";

export default function WsMemberCardSkeleton() {
  return (
    <div className="flex items-center gap-4 border-b p-4 last:border-b-0">
      <Skeleton className="h-10 w-10 rounded-full shrink-0" />

      <div className="flex-1 space-y-1.5">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-3 w-20" />
      </div>

      <Skeleton className="h-9 w-32 shrink-0" />
      <Skeleton className="h-9 w-9 rounded-md shrink-0" />
    </div>
  );
}
