import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { getImageUrl } from "@/lib/utils";

export default function UserCard({ user }) {
  return (
    <Link
      to={`/users/${user?.id}`}
      className="flex gap-4 rounded-xl border bg-card p-5 transition-all hover:-translate-y-0.5"
      style={{ boxShadow: "var(--shadow-soft)" }}
    >
      <Avatar className="h-14 w-14">
        <AvatarImage src={getImageUrl(user?.avatar)} />
        <AvatarFallback>{user?.full_name?.[0]}</AvatarFallback>
      </Avatar>
      <div className="min-w-0 flex-1">
        <div className="font-semibold">{user?.full_name}</div>
        <div className="text-xs text-muted-foreground">@{user?.username}</div>
        <p className="mt-1 line-clamp-1 text-sm text-muted-foreground">
          {user?.bio}
        </p>
        <div className="mt-2 flex flex-wrap gap-1">
          {user?.skills?.slice(0, 3).map((s) => (
            <Badge key={s?.id} variant="secondary" className="text-xs">
              {s?.label}
            </Badge>
          ))}
        </div>
      </div>
    </Link>
  );
}
