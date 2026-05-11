import EmptyCard from "../cards/EmptyCard";
import { InboxIcon } from "lucide-react";
import { Spinner } from "../ui/spinner";
import WorkspaceCard from "../cards/WorkspaceCard";

export default function WorkspacesList({ workspaces, isLoading }) {
  return isLoading ? (
    <div className="w-fit mx-auto my-[10%]">
      <Spinner />
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
