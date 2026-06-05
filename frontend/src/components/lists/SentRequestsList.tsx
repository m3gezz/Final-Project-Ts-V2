import EmptyCard from "../cards/EmptyCard";
import { InboxIcon } from "lucide-react";
import SentRequestCardSkeleton from "../skeletons/SentRequestCardSkeleton";
import ProjectSentRequestCard from "../cards/ProjectSentRequestCard";
import UserSentRequestCard from "../cards/UserSentRequestCard";
import type { RequestType } from "@/assets/types";
import NoContentCard from "../cards/NoContentCard";

export default function SentRequestsList({
  requests,
  isLoading,
  type = "user",
}: {
  requests: RequestType[];
  isLoading: boolean;
  type?: string;
}) {
  return isLoading ? (
    <div className="mt-6 grid lg:grid-cols-3 gap-4">
      {[...Array(2)].map((_, i) => (
        <SentRequestCardSkeleton key={i} />
      ))}
    </div>
  ) : requests?.length ? (
    <div className="mt-6 grid lg:grid-cols-3 gap-4">
      {requests?.map((r) =>
        type === "user" ? (
          <UserSentRequestCard key={r?.id} request={r} />
        ) : (
          <ProjectSentRequestCard key={r?.id} request={r} />
        ),
      )}
    </div>
  ) : (
    <NoContentCard
      icon={InboxIcon}
      title="No sent requests"
      description="Sent requests will appear here."
    />
  );
}
