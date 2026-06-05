import EmptyCard from "../cards/EmptyCard";
import { InboxIcon, UsersIcon } from "lucide-react";
import InvitingUserCard from "../cards/InvitingUserCard";
import InvitingUserCardSkeleton from "../skeletons/InvitingUserCardSkeleton";
import type { UserType } from "@/assets/types";
import NoContentCard from "../cards/NoContentCard";

export default function InvitingUsersList({
  users,
  isLoading,
}: {
  users: UserType[];
  isLoading: boolean;
}) {
  return isLoading ? (
    <div className="max-h-60 space-y-2 overflow-auto">
      {[...Array(3)].map((_, i) => (
        <InvitingUserCardSkeleton key={i} />
      ))}
    </div>
  ) : users?.length ? (
    <div className="max-h-60 space-y-2 overflow-auto">
      {users?.map((u) => (
        <InvitingUserCard key={u?.id} user={u} />
      ))}
    </div>
  ) : (
    <NoContentCard
      icon={UsersIcon}
      title="No users to invite"
      description="Invite users to collaborate on this project and see them here."
    />
  );
}
