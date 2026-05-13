import WsMemberCard, { type Member } from "../cards/WsMemberCard";
import EmptyCard from "../cards/EmptyCard";
import { InboxIcon } from "lucide-react";
import { Skeleton } from "../ui/skeleton";

export default function WsMembersList({
  members,
  isLoading,
}: {
  members: Member[];
  isLoading: boolean;
}) {
  return isLoading ? (
    <div className="rounded-xl border">
      {[...Array(3)].map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-4 border-b p-4 last:border-b-0"
        >
          <Skeleton className="w-10 h-10 rounded-full" />
          <div className="space-y-1">
            <Skeleton className="w-20 h-3" />
            <Skeleton className="w-30 h-2.5" />
          </div>
        </div>
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
