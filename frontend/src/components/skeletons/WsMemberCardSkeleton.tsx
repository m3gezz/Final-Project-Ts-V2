import { Skeleton } from "../ui/skeleton";

export default function WsMemberCardSkeleton() {
  return (
    <div className="flex items-center gap-4 border-b p-4 last:border-b-0">
      <Skeleton className="w-10 h-10 rounded-full" />
      <div className="space-y-1">
        <Skeleton className="w-20 h-3" />
        <Skeleton className="w-30 h-2.5" />
      </div>
    </div>
  );
}
