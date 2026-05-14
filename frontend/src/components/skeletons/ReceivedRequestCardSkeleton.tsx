import { Skeleton } from "../ui/skeleton";

export default function ReceivedRequestCardSkeleton() {
  return (
    <div className="flex items-start gap-2 border p-4 rounded-xl">
      <Skeleton className="w-10 h-10 rounded-full" />
      <div className="flex justify-between w-full">
        <div className="space-y-2">
          <Skeleton className="h-2.5 w-30" />
          <Skeleton className="h-10 w-80" />
        </div>
        <div className="flex gap-2 items-center">
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-6 w-20" />
        </div>
      </div>
    </div>
  );
}
