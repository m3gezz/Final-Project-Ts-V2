import WsMemberCard from "../cards/WsMemberCard";
import EmptyCard from "../cards/EmptyCard";
import { InboxIcon, UsersIcon } from "lucide-react";
import WsMemberCardSkeleton from "../skeletons/WsMemberCardSkeleton";
import type { MembershipType } from "@/assets/types";
import NoContentCard from "../cards/NoContentCard";

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
    <NoContentCard
      icon={UsersIcon}
      title="No members found"
      description="Members will appear here."
    />
  );
}
