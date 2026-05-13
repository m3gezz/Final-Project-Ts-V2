import ProjectCard, { type Project } from "../cards/ProjectCard";
import EmptyCard from "../cards/EmptyCard";
import { InboxIcon } from "lucide-react";
import ProjectCardSkeleton from "../skeletons/ProjectCardSkeleton";

export default function ProjectsList({
  projects,
  isLoading,
}: {
  projects: Project[];
  isLoading: boolean;
}) {
  return isLoading ? (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {[...Array(4)].map((_, i) => (
        <ProjectCardSkeleton key={i} />
      ))}
    </div>
  ) : projects?.length ? (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {projects?.map((p) => (
        <ProjectCard key={p.id} project={p} />
      ))}
    </div>
  ) : (
    <EmptyCard
      icon={InboxIcon}
      title="Nothing here"
      description="You're all caught up."
    />
  );
}
