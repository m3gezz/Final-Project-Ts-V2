import { Skeleton } from "../ui/skeleton";

export default function FeedSkeleton({
  calculatedOpacity,
}: {
  calculatedOpacity: number;
}) {
  return (
    <li className="border-l pb-4" style={{ opacity: calculatedOpacity }}>
      <div className="flex items-start gap-2">
        <div className="-ml-1 h-2 w-2 bg-muted-foreground/40 rounded-full mt-2" />

        <div className="space-y-2 flex-1">
          <Skeleton className="h-4 w-1/3" />

          <Skeleton className="h-3 w-3/4" />
        </div>
      </div>

      <div className="ml-4 mt-2">
        <Skeleton className="h-3 w-16" />
      </div>
    </li>
  );
}
