import { Skeleton } from "../ui/skeleton";

export default function CommentCardSkeleton() {
  return (
    <div className="flex gap-3">
      <Skeleton className="w-8 h-8" />
      <div className="flex">
        <Skeleton className="h-3 w-25" />
        <Skeleton className="h-10 w-2/3" />
      </div>
    </div>
  );
}
