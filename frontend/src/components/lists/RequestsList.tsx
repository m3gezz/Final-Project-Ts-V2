import EmptyCard from "../cards/EmptyCard";
import { InboxIcon } from "lucide-react";
import { Spinner } from "../ui/spinner";
import RequestCard from "../cards/RequestCard";

export default function RequestsList({ requests, isLoading }) {
  return isLoading ? (
    <div className="w-fit mx-auto my-[10%]">
      <Spinner />
    </div>
  ) : requests?.length ? (
    <div className="mt-6 space-y-3">
      {requests?.map((r) => (
        <RequestCard key={r?.id} request={r} />
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
