import EmptyCard from "../cards/EmptyCard";
import { InboxIcon, UsersIcon } from "lucide-react";
import UserCard from "../cards/UserCard";
import UserCardSkeleton from "../skeletons/UserCardSkeleton";
import type { PopulatedUser } from "@/assets/types";
import NoContentCard from "../cards/NoContentCard";

export default function UsersList({
  users,
  isLoading,
}: {
  users: PopulatedUser[];
  isLoading: boolean;
}) {
  return isLoading ? (
    <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {[...Array(4)].map((_, i) => (
        <UserCardSkeleton key={i} />
      ))}
    </div>
  ) : users?.length ? (
    <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {users?.map((u) => (
        <UserCard key={u?.id} user={u} />
      ))}
    </div>
  ) : (
    <NoContentCard
      icon={UsersIcon}
      title="No users found"
      description="Try searching for a different user."
    />
  );
}
