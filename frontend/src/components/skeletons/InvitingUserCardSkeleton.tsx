import { Skeleton } from "../ui/skeleton";

export default function InvitingUserCardSkeleton() {
  return (
    <div className="flex items-center gap-3 rounded-lg p-2">
      <Skeleton className="h-8 w-8 rounded-full shrink-0" />

      <div className="flex-1 space-y-1.5 min-w-0">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-3 w-16" />
      </div>

      <Skeleton className="h-8 w-16 rounded-md shrink-0" />
    </div>
  );
}
