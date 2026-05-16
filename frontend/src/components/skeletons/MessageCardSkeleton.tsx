import { Skeleton } from "../ui/skeleton";

export default function MessageCardSkeleton() {
  return (
    <>
      <div className="flex gap-2 items-start">
        <Skeleton className="h-9 w-9 rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="w-30 h-3" />
          <Skeleton className="w-[80%] h-10 max-w-200" />
        </div>
      </div>
      <div className="flex gap-2 items-start">
        <Skeleton className="h-9 w-9 rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="w-30 h-3" />
          <Skeleton className="w-[80%] h-10 max-w-200" />
        </div>
      </div>
      <div className="flex flex-row-reverse gap-2 items-start">
        <Skeleton className="h-9 w-9 rounded-full" />
        <div className="flex-1 space-y-2 flex flex-col items-end">
          <Skeleton className="w-30 h-3" />
          <Skeleton className="w-[80%] h-10 max-w-200" />
        </div>
      </div>
    </>
  );
}
