import EmptyCard from "../cards/EmptyCard";
import { BriefcaseIcon, InboxIcon } from "lucide-react";
import WorkspaceCard from "../cards/WorkspaceCard";
import WorkspaceCardSkeleton from "../skeletons/WorkspaceCardSkeleton";
import type { PopulatedWorkspace } from "@/assets/types";
import NoContentCard from "../cards/NoContentCard";

export default function WorkspacesList({
  workspaces,
  isLoading,
}: {
  workspaces: PopulatedWorkspace[];
  isLoading: boolean;
}) {
  return isLoading ? (
    <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {[...Array(4)]?.map((_, i) => (
        <WorkspaceCardSkeleton key={i} />
      ))}
    </div>
  ) : workspaces?.length ? (
    <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {workspaces?.map((w) => (
        <WorkspaceCard key={w?.id} workspace={w} />
      ))}
    </div>
  ) : (
    <NoContentCard
      icon={BriefcaseIcon}
      title="No workspaces yet"
      description="Create your first workspace to get started."
    />
  );
}
