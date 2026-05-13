import { Skeleton } from "../ui/skeleton";

export default function UserCardSkeleton() {
  return (
    <div className="flex gap-4 border rounded-xl p-5">
      <Skeleton className="h-14 w-14 rounded-full" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-35" />
        <Skeleton className="h-2.5 w-25" />
        <Skeleton className="h-2.5 w-45" />
        <div className="flex gap-2">
          <Skeleton className="h-3 w-12" />
          <Skeleton className="h-3 w-12" />
          <Skeleton className="h-3 w-12" />
        </div>
      </div>
    </div>
  );
}
