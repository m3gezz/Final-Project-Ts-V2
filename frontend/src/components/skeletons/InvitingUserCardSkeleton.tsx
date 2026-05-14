import { Skeleton } from "../ui/skeleton";

export default function InvitingUserCardSkeleton() {
  return (
    <div className="flex items-start gap-2">
      <Skeleton className="w-8 h-8 rounded-full" />
      <div className="space-y-1">
        <Skeleton className="w-20 h-3" />
        <Skeleton className="w-30 h-2.5" />
      </div>
    </div>
  );
}
