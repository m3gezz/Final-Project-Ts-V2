import EmptyCard from "../cards/EmptyCard";
import { InboxIcon } from "lucide-react";
import ReceivedRequestCardSkeleton from "../skeletons/ReceivedRequestCardSkeleton";
import ProjectReceivedRequestCard from "../cards/ProjectReceivedRequestCard";
import UserReceivedRequestCard from "../cards/UserReceivedRequestCard";
import type { RequestType } from "@/assets/types";
import NoContentCard from "../cards/NoContentCard";

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
    <div className="mt-6 grid lg:grid-cols-2 gap-4">
      {[...Array(2)].map((_, i) => (
        <ReceivedRequestCardSkeleton key={i} />
      ))}
    </div>
  ) : requests?.length ? (
    <div className="mt-6 grid lg:grid-cols-2 gap-4">
      {requests?.map((r) =>
        type === "user" ? (
          <UserReceivedRequestCard key={r?.id} request={r} />
        ) : (
          <ProjectReceivedRequestCard key={r?.id} request={r} />
        ),
      )}
    </div>
  ) : (
    <NoContentCard
      icon={InboxIcon}
      title="No pending requests"
      description="Pending requests will appear here."
    />
  );
}
