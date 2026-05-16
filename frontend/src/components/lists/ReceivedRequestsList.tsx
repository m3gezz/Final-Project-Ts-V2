import EmptyCard from "../cards/EmptyCard";
import { InboxIcon } from "lucide-react";
import type { Request } from "../cards/UserSentRequestCard";
import ReceivedRequestCardSkeleton from "../skeletons/ReceivedRequestCardSkeleton";
import ProjectReceivedRequestCard from "../cards/ProjectReceivedRequestCard";
import UserReceivedRequestCard from "../cards/UserReceivedRequestCard";

export default function ReceivedRequestList({
  requests,
  isLoading,
  type = "user",
}: {
  requests: Request[];
  isLoading: boolean;
  type?: string;
}) {
  return isLoading ? (
    <div className="mt-6 space-y-3">
      {[...Array(2)].map((_, i) => (
        <ReceivedRequestCardSkeleton key={i} />
      ))}
    </div>
  ) : requests?.length ? (
    <div className="space-y-2">
      {requests?.map((r) =>
        type === "user" ? (
          <UserReceivedRequestCard key={r?.id} request={r} />
        ) : (
          <ProjectReceivedRequestCard key={r?.id} request={r} />
        ),
      )}
    </div>
  ) : (
    <EmptyCard
      icon={InboxIcon}
      title="Nothing here"
      description="You're all caught up."
    />
  );
}
