import EmptyCard from "../cards/EmptyCard";
import { InboxIcon } from "lucide-react";
import SentRequestCardSkeleton from "../skeletons/SentRequestCardSkeleton";
import ProjectSentRequestCard from "../cards/ProjectSentRequestCard";
import UserSentRequestCard from "../cards/UserSentRequestCard";
import type { RequestType } from "@/assets/types";

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
    <div className="mt-6 space-y-3">
      {[...Array(2)].map((_, i) => (
        <SentRequestCardSkeleton key={i} />
      ))}
    </div>
  ) : requests?.length ? (
    <div className="mt-6 space-y-3">
      {requests?.map((r) =>
        type === "user" ? (
          <UserSentRequestCard key={r?.id} request={r} />
        ) : (
          <ProjectSentRequestCard key={r?.id} request={r} />
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
