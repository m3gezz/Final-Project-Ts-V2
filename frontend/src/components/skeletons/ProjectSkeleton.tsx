import { Skeleton } from "../ui/skeleton";

export default function ProjectSkeleton() {
  return (
    <main className="mx-auto max-w-5xl space-y-8">
      <section className="overflow-hidden rounded-2xl border">
        <div className="aspect-21/9 bg-muted/40 w-full" />
        <div className="bg-card p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="space-y-3 flex-1 min-w-50">
              <Skeleton className="h-5 w-24 rounded-full" />
              <Skeleton className="h-8 w-2/3 max-w-md" />
              <div className="flex items-center gap-2 pt-1">
                <Skeleton className="h-6 w-6 rounded-full" />
                <Skeleton className="h-4 w-32" />
              </div>
            </div>
            <div className="flex gap-2 shrink-0">
              <Skeleton className="h-10 w-16" />
              <Skeleton className="h-10 w-32" />
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-3">
        <div className="space-y-6 md:col-span-2">
          <section className="rounded-xl border bg-card p-6 space-y-3">
            <Skeleton className="h-6 w-20" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
            </div>
          </section>

          <section className="rounded-xl border bg-card p-6 space-y-3">
            <Skeleton className="h-6 w-24" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          </section>

          <section className="rounded-xl border bg-card p-6 space-y-4">
            <Skeleton className="h-6 w-36" />
            <div className="flex gap-2 items-end">
              <Skeleton className="h-20 flex-1 rounded-md" />
              <Skeleton className="h-10 w-10 shrink-0" />
            </div>
          </section>
        </div>

        <aside className="space-y-6">
          <section className="rounded-xl border bg-card p-6 space-y-3">
            <Skeleton className="h-4 w-28" />
            <div className="flex flex-wrap gap-1.5">
              <Skeleton className="h-5 w-16 rounded-full" />
              <Skeleton className="h-5 w-24 rounded-full" />
              <Skeleton className="h-5 w-20 rounded-full" />
            </div>
          </section>

          <section className="rounded-xl border bg-card p-6 space-y-3">
            <Skeleton className="h-4 w-24" />
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center gap-3 rounded-lg p-2">
                  <Skeleton className="h-8 w-8 rounded-full shrink-0" />
                  <div className="space-y-1.5 flex-1">
                    <Skeleton className="h-4 w-28" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                </div>
              ))}
            </div>
          </section>
        </aside>
      </section>
    </main>
  );
}
