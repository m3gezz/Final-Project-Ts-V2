import { Skeleton } from "../ui/skeleton";

export default function MessageCardSkeleton() {
  return (
    <div className="w-full space-y-6">
      <article className="flex items-end gap-4 justify-end">
        <div className="w-full flex flex-col items-end gap-1.5">
          <Skeleton className="h-10 w-1/2 max-w-[320px] rounded-lg rounded-br-none" />
          <div className="flex items-center gap-1">
            <Skeleton className="h-3 w-3 rounded-full" />
            <Skeleton className="h-3 w-10" />
          </div>
        </div>
        <Skeleton className="h-9 w-9 rounded-full shrink-0" />
      </article>

      <article className="flex items-end gap-4">
        <Skeleton className="h-9 w-9 rounded-full shrink-0" />
        <div className="flex flex-col gap-1.5 w-full">
          <div className="w-full flex flex-col items-start gap-1.5">
            <Skeleton className="h-3 w-24 mb-0.5" />
            <Skeleton className="h-10 w-1/2 max-w-[320px] rounded-lg rounded-bl-none" />
            <div className="flex items-center gap-1">
              <Skeleton className="h-3 w-3 rounded-full" />
              <Skeleton className="h-3 w-10" />
            </div>
          </div>
        </div>
      </article>
    </div>
  );
}
