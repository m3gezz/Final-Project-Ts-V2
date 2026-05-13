import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { Button } from "../ui/button";
import { getImageUrl } from "@/lib/utils";
import type { User } from "./UserCard";
import { Link } from "react-router-dom";

export default function InvitingUserCard({ user }: { user: User }) {
  return (
    <div className="flex items-center gap-3 rounded-lg p-2 hover:bg-muted">
      <Avatar className="h-8 w-8">
        <AvatarImage src={getImageUrl(user?.avatar)} />
        <AvatarFallback>{user?.full_name?.[0]}</AvatarFallback>
      </Avatar>
      <Link className="flex-1 text-sm" to={`/users/${user?.id}`}>
        <div className="font-medium">{user?.full_name}</div>
        <div className="text-xs text-muted-foreground">@{user?.username}</div>
      </Link>
      <Button size="sm" variant="outline" onClick={() => mutate()}>
        Invite
      </Button>
    </div>
  );
}
