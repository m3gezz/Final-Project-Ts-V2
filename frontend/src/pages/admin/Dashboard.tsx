import SectionHeader from "@/components/common/SectionHeader";
import { users, projects, workspaces } from "@/app/mock-data";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Users as UsersIcon,
  FolderKanban,
  Briefcase,
  TrendingUp,
} from "lucide-react";

export default function Dashboard() {
  const stats = [
    { icon: UsersIcon, label: "Users", value: users.length, change: "+12%" },
    {
      icon: FolderKanban,
      label: "Projects",
      value: projects.length,
      change: "+4%",
    },
    {
      icon: Briefcase,
      label: "Workspaces",
      value: workspaces.length,
      change: "+8%",
    },
    { icon: TrendingUp, label: "Active today", value: 124, change: "+22%" },
  ];
  return (
    <div className="space-y-8">
      <SectionHeader
        title="Admin dashboard"
        description="Platform health at a glance."
      />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className="rounded-xl border bg-card p-5"
            style={{ boxShadow: "var(--shadow-soft)" }}
          >
            <div className="flex items-center justify-between">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                <s.icon className="h-4 w-4" />
              </div>
              <Badge variant="secondary" className="text-xs text-success">
                {s.change}
              </Badge>
            </div>
            <div className="mt-3 text-2xl font-semibold">{s.value}</div>
            <div className="text-xs text-muted-foreground">{s.label}</div>
          </div>
        ))}
      </div>
      <div className="rounded-xl border bg-card">
        <div className="border-b p-4">
          <h2 className="font-semibold">Recent users</h2>
        </div>
        <div>
          {users.map((u) => (
            <div
              key={u.id}
              className="flex items-center gap-3 border-b p-4 last:border-b-0"
            >
              <Avatar>
                <AvatarImage src={u.avatar} />
                <AvatarFallback>{u.full_name[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="text-sm font-medium">{u.full_name}</div>
                <div className="text-xs text-muted-foreground">{u.email}</div>
              </div>
              <Badge variant="outline">Active</Badge>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
