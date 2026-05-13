import EmptyCard from "../cards/EmptyCard";
import { InboxIcon } from "lucide-react";
import InvitingUserCard from "../cards/InvitingUserCard";
import type { User } from "../cards/UserCard";
import { Skeleton } from "../ui/skeleton";

export default function InvitingUsersList({
  users,
  isLoading,
}: {
  users: User[];
  isLoading: boolean;
}) {
  return isLoading ? (
    <div className="max-h-60 space-y-2 overflow-auto">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="flex items-start gap-2">
          <Skeleton className="w-8 h-8 rounded-full" />
          <div className="space-y-1">
            <Skeleton className="w-20 h-3" />
            <Skeleton className="w-30 h-2.5" />
          </div>
        </div>
      ))}
    </div>
  ) : users?.length ? (
    <div className="max-h-60 space-y-2 overflow-auto">
      {users?.map((u) => (
        <InvitingUserCard key={u?.id} user={u} />
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
