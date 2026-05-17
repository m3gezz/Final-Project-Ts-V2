import EmptyCard from "../cards/EmptyCard";
import { InboxIcon } from "lucide-react";
import UserCard from "../cards/UserCard";
import UserCardSkeleton from "../skeletons/UserCardSkeleton";
import type { PopulatedUser } from "@/assets/types";

export default function UsersList({
  users,
  isLoading,
}: {
  users: PopulatedUser[];
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
