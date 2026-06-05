import ProjectCard from "../cards/ProjectCard";
import EmptyCard from "../cards/EmptyCard";
import { FolderIcon, InboxIcon } from "lucide-react";
import ProjectCardSkeleton from "../skeletons/ProjectCardSkeleton";
import type { ProjectType } from "@/assets/types";
import NoContentCard from "../cards/NoContentCard";

export default function ProjectsList({
  projects,
  isLoading,
}: {
  projects: ProjectType[];
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
    <NoContentCard
      icon={FolderIcon}
      title="No projects yet"
      description="Create your first project to get started."
    />
  );
}
