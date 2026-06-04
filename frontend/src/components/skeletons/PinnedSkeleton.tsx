import { Skeleton } from "../ui/skeleton";

export default function PinnedSkeleton() {
  return (
    <li className="flex items-start gap-2 border-l pb-4">
      <div className="-ml-1 h-2 w-2 bg-muted-foreground/30 rounded-full mt-2" />

      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-28" />

        <div className="border rounded-2xl w-full px-4 py-3 mt-2">
          <div className="space-y-1.5">
            <Skeleton className="h-3 w-5/6" />
            <Skeleton className="h-3 w-2/3" />
          </div>
        </div>
      </div>
    </li>
  );
}
