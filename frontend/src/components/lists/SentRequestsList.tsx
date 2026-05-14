import EmptyCard from "../cards/EmptyCard";
import { InboxIcon } from "lucide-react";
import SentRequestCard, { type Request } from "../cards/SentRequestCard";
import SentRequestCardSkeleton from "../skeletons/SentRequestCardSkeleton";

export default function SentRequestsList({
  requests,
  isLoading,
}: {
  requests: Request[];
  isLoading: boolean;
}) {
  return isLoading ? (
    <div className="mt-6 space-y-3">
      {[...Array(3)].map((_, i) => (
        <SentRequestCardSkeleton key={i} />
      ))}
    </div>
  ) : requests?.length ? (
    <div className="mt-6 space-y-3">
      {requests?.map((r) => (
        <SentRequestCard key={r?.id} request={r} />
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
