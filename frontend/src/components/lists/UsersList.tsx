import EmptyCard from "../cards/EmptyCard";
import { InboxIcon } from "lucide-react";
import UserCard, { type User } from "../cards/UserCard";
import UserCardSkeleton from "../skeletons/UserCardSkeleton";

export default function UsersList({
  users,
  isLoading,
}: {
  users: User[];
  isLoading: boolean;
}) {
  return isLoading ? (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {[...Array(4)].map((_, i) => (
        <UserCardSkeleton key={i} />
      ))}
    </div>
  ) : users?.length ? (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {users?.map((u) => (
        <UserCard key={u?.id} user={u} />
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
