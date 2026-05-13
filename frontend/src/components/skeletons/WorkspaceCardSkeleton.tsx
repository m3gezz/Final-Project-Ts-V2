import { Skeleton } from "../ui/skeleton";

export default function WorkspaceCardSkeleton() {
  return (
    <div className="border rounded-xl p-5">
      <div className="flex justify-between items-start">
        <div className="space-y-2">
          <Skeleton className="h-3 w-12" />
          <Skeleton className="h-3 w-12" />
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-2.5 w-30 mt-2" />
        </div>
        <Skeleton className="w-10 h-10" />
      </div>
      <div className="flex items-center justify-between mt-4">
        <Skeleton className="h-6 w-6 rounded-full" />
        <Skeleton className="h-2.5 w-10" />
      </div>
    </div>
  );
}
