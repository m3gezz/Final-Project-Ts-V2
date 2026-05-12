import { Spinner } from "../ui/spinner";
import WsMemberCard from "../cards/WsMemberCard";
import EmptyCard from "../cards/EmptyCard";
import { InboxIcon } from "lucide-react";

export default function WsMembersList({ members, isLoading }) {
  return isLoading ? (
    <div className="w-fit mx-auto my-[10%]">
      <Spinner />
    </div>
  ) : members?.length ? (
    <div className="rounded-xl border bg-card">
      {members?.map((m) => (
        <WsMemberCard key={m?.user_id} member={m} />
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
