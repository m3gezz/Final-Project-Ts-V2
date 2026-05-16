import WsMemberCard, { type Member } from "../cards/WsMemberCard";
import EmptyCard from "../cards/EmptyCard";
import { InboxIcon } from "lucide-react";
import WsMemberCardSkeleton from "../skeletons/WsMemberCardSkeleton";

export default function WsMembersList({
  members,
  isLoading,
}: {
  members: Member[];
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
