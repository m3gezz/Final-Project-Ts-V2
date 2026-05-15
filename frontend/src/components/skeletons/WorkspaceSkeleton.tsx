import { Skeleton } from "../ui/skeleton";

export default function WorkspaceSkeleton() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Skeleton className="w-40 h-3" />
        <Skeleton className="w-35 h-2.5" />
      </div>
      <div className="grid gap-3 md:grid-cols-3">
        <div className="rounded-xl border p-5 space-y-4">
          <Skeleton className="w-20 h-2.5" />
          <Skeleton className="w-5 h-8 rounded-sm" />
          <Skeleton className="w-full h-2 rounded-sm" />
        </div>
        <div className="rounded-xl border p-5 space-y-4">
          <Skeleton className="w-20 h-2.5" />
          <Skeleton className="w-5 h-8 rounded-sm" />
        </div>
        <div className="rounded-xl border p-5 space-y-4">
          <Skeleton className="w-20 h-2.5" />
          <Skeleton className="w-5 h-8 rounded-sm" />
        </div>
      </div>
      <div className="rounded-xl border bg-card p-6">
        <Skeleton className="w-30 h-4" />
        <ul className="mt-4 space-y-4 text-sm">
          {[...Array(4)].map((_, i) => (
            <li key={i} className="flex items-center justify-between gap-3">
              <Skeleton className="w-80 h-2.5" />
              <Skeleton className="w-10 h-2.5" />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
