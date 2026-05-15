import { Skeleton } from "../ui/skeleton";

export default function TaskCardSkeleton() {
  return (
    <div className="rounded-xl border p-3 space-y-4">
      <Skeleton className="w-20 h-3" />
      <Skeleton className="w-40 h-2.5" />
      <Skeleton className="w-6 h-6 rounded-full" />
    </div>
  );
}
