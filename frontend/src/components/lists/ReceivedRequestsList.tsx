import EmptyCard from "../cards/EmptyCard";
import { InboxIcon } from "lucide-react";
import ReceivedRequestCardSkeleton from "../skeletons/ReceivedRequestCardSkeleton";
import ProjectReceivedRequestCard from "../cards/ProjectReceivedRequestCard";
import UserReceivedRequestCard from "../cards/UserReceivedRequestCard";
import type { RequestType } from "@/assets/types";

export default function ReceivedRequestList({
  requests,
  isLoading,
  type = "user",
}: {
  requests: RequestType[];
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
