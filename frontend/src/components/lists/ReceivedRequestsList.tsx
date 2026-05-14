import EmptyCard from "../cards/EmptyCard";
import { InboxIcon } from "lucide-react";
import ReceivedRequestCard from "../cards/ReceivedRequestCard";
import type { Request } from "../cards/SentRequestCard";
import ReceivedRequestCardSkeleton from "../skeletons/ReceivedRequestCardSkeleton";

export default function ReceivedRequestList({
  requests,
  isLoading,
}: {
  requests: Request[];
  isLoading: boolean;
}) {
  return isLoading ? (
    <div className="mt-6 space-y-3">
      {[...Array(3)].map((_, i) => (
        <ReceivedRequestCardSkeleton key={i} />
      ))}
    </div>
  ) : requests?.length ? (
    <div className="space-y-2">
      {requests?.map((r) => (
        <ReceivedRequestCard key={r?.id} request={r} />
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
