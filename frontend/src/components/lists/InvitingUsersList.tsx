import React from "react";
import { Spinner } from "../ui/spinner";
import EmptyCard from "../cards/EmptyCard";
import { InboxIcon } from "lucide-react";
import InvitingUserCard from "../cards/InvitingUserCard";

export default function InvitingUsersList({ users, isLoading }) {
  return isLoading ? (
    <div className="w-fit mx-auto my-[10%]">
      <Spinner />
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
