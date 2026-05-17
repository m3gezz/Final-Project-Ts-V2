import EmptyCard from "../cards/EmptyCard";
import { InboxIcon } from "lucide-react";
import WorkspaceCard from "../cards/WorkspaceCard";
import WorkspaceCardSkeleton from "../skeletons/WorkspaceCardSkeleton";
import type { PopulatedWorkspace } from "@/assets/types";

export default function WorkspacesList({
  workspaces,
  isLoading,
}: {
  workspaces: PopulatedWorkspace[];
  isLoading: boolean;
}) {
  return isLoading ? (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {[...Array(4)]?.map((_, i) => (
        <WorkspaceCardSkeleton key={i} />
      ))}
    </div>
  ) : workspaces?.length ? (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {workspaces?.map((w) => (
        <WorkspaceCard key={w?.id} workspace={w} />
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
