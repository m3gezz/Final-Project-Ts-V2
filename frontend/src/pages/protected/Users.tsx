import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/slices/Header";
import { users } from "@/data/exp";

export default function Users() {
  return (
    <div>
      <Header title="Users" description="Find people to collaborate with." />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {users.map((u) => (
          <Link
            key={u.id}
            to={`/users/${u.id}`}
            className="flex gap-4 rounded-xl border bg-card p-5 transition-all hover:-translate-y-0.5"
            style={{ boxShadow: "var(--shadow-soft)" }}
          >
            <Avatar className="h-14 w-14">
              <AvatarImage src={u.avatar} />
              <AvatarFallback>{u.full_name[0]}</AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <div className="font-semibold">{u.full_name}</div>
              <div className="text-xs text-muted-foreground">@{u.username}</div>
              <p className="mt-1 line-clamp-1 text-sm text-muted-foreground">
                {u.bio}
              </p>
              <div className="mt-2 flex flex-wrap gap-1">
                {u.skills.slice(0, 3).map((s) => (
                  <Badge key={s} variant="secondary" className="text-xs">
                    {s}
                  </Badge>
                ))}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
