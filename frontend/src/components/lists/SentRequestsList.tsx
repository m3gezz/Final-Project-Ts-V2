import EmptyCard from "../cards/EmptyCard";
import { InboxIcon } from "lucide-react";
import { Spinner } from "../ui/spinner";
import SentRequestCard, { type Request } from "../cards/SentRequestCard";

export default function SentRequestsList({
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
