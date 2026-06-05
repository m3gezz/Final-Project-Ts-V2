import { Skeleton } from "@/components/ui/skeleton";
import Header from "../slices/Header";
import { PenIcon } from "lucide-react";

export default function ProjectManipulatorSkeleton() {
  return (
    <article>
      <Header
        icon={PenIcon}
        title={"Update this project"}
        description="Tell the community what you're building and the team you need."
      />
      <section className="w-[90%] mx-auto flex items-center justify-around my-10">
        <Skeleton className="rounded-full w-8 h-8 shrink-0" />

        <Skeleton className="h-2 flex-1 mx-2 rounded-full" />

        <Skeleton className="rounded-full w-8 h-8 shrink-0" />

        <Skeleton className="h-2 flex-1 mx-2 rounded-full" />

        <Skeleton className="rounded-full w-8 h-8 shrink-0" />
      </section>
      <section className="grid lg:grid-cols-[1fr_1fr] gap-4 p-4">
        <Skeleton className="aspect-video bg-muted/40 rounded-lg w-full relative flex items-center justify-center" />

        <div className="flex flex-col gap-4">
          <div className="space-y-2">
            <Skeleton className="h-4 w-12" />
            <Skeleton className="h-10 w-full" />
          </div>

          <div className="space-y-2">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-10 w-full" />
          </div>

          <div className="space-y-2">
            <Skeleton className="h-4 w-20" />
            <div className="flex gap-2 flex-wrap">
              <Skeleton className="h-7 w-16 rounded-full" />

              <Skeleton className="h-7 w-24 rounded-full" />

              <Skeleton className="h-7 w-20 rounded-full" />
            </div>
          </div>

          <div className="flex items-center justify-end mt-auto pt-4">
            <Skeleton className="h-10 w-24" />
          </div>
        </div>
      </section>
    </article>
  );
}
