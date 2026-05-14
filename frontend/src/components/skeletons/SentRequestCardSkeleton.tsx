import { Skeleton } from "../ui/skeleton";

export default function SentRequestCardSkeleton() {
  return (
    <div className="flex items-start gap-2 border p-4 rounded-xl">
      <Skeleton className="w-10 h-10 rounded-full" />
      <div className="space-y-2">
        <Skeleton className="h-2.5 w-30" />
        <Skeleton className="h-10 w-80" />
      </div>
    </div>
  );
}
