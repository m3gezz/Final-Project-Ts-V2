import { Skeleton } from "../ui/skeleton";

export default function WorkspaceSkeleton() {
  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <div className="flex items-center gap-2">
          <Skeleton className="h-6 w-6 rounded-md shrink-0" />
          <Skeleton className="h-8 w-64" />
        </div>
        <Skeleton className="h-4 w-40" />
      </header>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border bg-card overflow-hidden">
          <div className="p-4 space-y-2 aspect-video w-full relative bg-muted/40 flex items-start justify-end flex-col">
            <Skeleton className="h-5 w-1/2" />
            <Skeleton className="h-4 w-5/6" />
          </div>
        </div>

        <div className="rounded-xl border bg-card p-4 space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <Skeleton className="h-5 w-16 rounded-md" />
              <Skeleton className="h-5 w-24" />
            </div>
            <Skeleton className="h-12 w-12 rounded-full shrink-0" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-7 w-36" />
            <Skeleton className="h-2 w-full rounded-full" />
          </div>
          <Skeleton className="h-4 w-48" />
        </div>

        <div className="rounded-xl border bg-card p-4 space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <Skeleton className="h-5 w-14 rounded-md" />
              <Skeleton className="h-5 w-28" />
            </div>
            <Skeleton className="h-12 w-12 rounded-full shrink-0" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-7 w-20" />
            <div className="flex items-center pl-2">
              {[...Array(4)].map((_, i) => (
                <Skeleton
                  key={i}
                  className="h-6 w-6 rounded-full -ml-2 border border-card"
                />
              ))}
            </div>
          </div>
          <Skeleton className="h-4 w-24" />
        </div>
      </div>

      <div className="rounded-xl border bg-card p-6 space-y-4">
        <Skeleton className="h-6 w-32" />
        <div className="space-y-3 pt-1">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <Skeleton className="h-1.5 w-1.5 rounded-full shrink-0" />
              <Skeleton className="h-4 w-2/3 max-w-md" />
              <Skeleton className="h-3 w-12 ml-auto shrink-0" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
