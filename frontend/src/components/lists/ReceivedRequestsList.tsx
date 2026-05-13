import EmptyCard from "../cards/EmptyCard";
import { InboxIcon } from "lucide-react";
import { Spinner } from "../ui/spinner";
import ReceivedRequestCard from "../cards/ReceivedRequestCard";
import type { Request } from "../cards/SentRequestCard";

export default function ReceivedRequestList({
  requests,
  isLoading,
}: {
  requests: Request[];
  isLoading: boolean;
}) {
  return isLoading ? (
    <div className="w-fit mx-auto my-[10%]">
      <Spinner />
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
