import EmptyCard from "../cards/EmptyCard";
import { InboxIcon } from "lucide-react";
import { Spinner } from "../ui/spinner";
import ProjectRequestCard from "../cards/ProjectRequestCard";

export default function ProjectRequestList({ requests, isLoading }) {
  return isLoading ? (
    <div className="w-fit mx-auto my-[10%]">
      <Spinner />
    </div>
  ) : requests?.length ? (
    <div className="space-y-2">
      {requests?.map((r) => (
        <ProjectRequestCard key={r?.id} request={r} />
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
