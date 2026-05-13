import { Skeleton } from "../ui/skeleton";

export default function ProjectCardSkeleton() {
  return (
    <div className="border rounded-xl">
      <Skeleton className="aspect-video rounded-xl" />
      <div className="p-3 space-y-1.5">
        <Skeleton className="h-4 w-35" />
        <Skeleton className="h-3 w-45" />
        <div className="flex items-center gap-1">
          <Skeleton className="h-6 w-6 rounded-full" />
          <Skeleton className="h-2.5 w-20" />
        </div>
      </div>
    </div>
  );
}
