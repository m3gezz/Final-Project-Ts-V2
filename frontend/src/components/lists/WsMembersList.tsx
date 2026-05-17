import WsMemberCard from "../cards/WsMemberCard";
import EmptyCard from "../cards/EmptyCard";
import { InboxIcon } from "lucide-react";
import WsMemberCardSkeleton from "../skeletons/WsMemberCardSkeleton";
import type { MembershipType } from "@/assets/types";

export default function WsMembersList({
  members,
  isLoading,
}: {
  members: MembershipType[];
  isLoading: boolean;
}) {
  return isLoading ? (
    <div className="rounded-xl border">
      {[...Array(2)].map((_, i) => (
        <WsMemberCardSkeleton key={i} />
      ))}
    </div>
  ) : members?.length ? (
    <div className="rounded-xl border bg-card">
      {members?.map((m) => (
        <WsMemberCard key={m?.user?.id} member={m} />
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
