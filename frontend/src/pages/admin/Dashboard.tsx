import { adminDashboard } from "@/api/functions/users";
import type { UserType } from "@/assets/types";
import Header from "@/components/slices/Header";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { getImageUrl } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import {
  Users as UsersIcon,
  FolderKanban,
  Briefcase,
  TrendingUp,
} from "lucide-react";

export default function Dashboard() {
  const { data: adminDashboardData, isLoading: isAdminDashboardLoading } =
    useQuery({
      queryKey: ["adminDashboard"],
      queryFn: adminDashboard,
    });

  const stats = [
    {
      icon: UsersIcon,
      label: "Users",
      value: adminDashboardData?.count?.users ?? 0,
      change: `+${adminDashboardData?.growth?.users ?? 0}%`,
    },
    {
      icon: FolderKanban,
      label: "Projects",
      value: adminDashboardData?.count?.projects ?? 0,
      change: `+${adminDashboardData?.growth?.projects ?? 0}%`,
    },
    {
      icon: Briefcase,
      label: "Workspaces",
      value: adminDashboardData?.count?.workspaces ?? 0,
      change: `+${adminDashboardData?.growth?.workspaces ?? 0}%`,
    },
    {
      icon: TrendingUp,
      label: "Active today",
      value: adminDashboardData?.count?.active_users ?? 0,
      change: `+${adminDashboardData?.growth?.active_users ?? 0}%`,
    },
  ];

  return (
    <div className="space-y-8">
      <Header
        title="Admin dashboard"
        description="Platform health at a glance."
      />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats?.map((s) => (
          <div key={s?.label} className="rounded-xl border bg-card p-5">
            <div className="flex items-center justify-between">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                <s.icon className="h-4 w-4" />
              </div>
              <Badge variant="secondary" className="text-xs text-success">
                {s?.change}
              </Badge>
            </div>
            <div className="mt-3 text-2xl font-semibold">{s?.value}</div>
            <div className="text-xs text-muted-foreground">{s?.label}</div>
          </div>
        ))}
      </div>
      <div className="rounded-xl border bg-card">
        <div className="border-b p-4">
          <h2 className="font-semibold">Recent users</h2>
        </div>
        <div>
          {isAdminDashboardLoading ? (
            <div className="flex items-center gap-3 border-b p-4 last:border-b-0">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-3 w-30" />
                <Skeleton className="h-2.5 w-25" />
              </div>
            </div>
          ) : (
            adminDashboardData?.new_users?.map((u: UserType) => (
              <div
                key={u?.id}
                className="flex items-center gap-3 border-b p-4 last:border-b-0"
              >
                <Avatar>
                  <AvatarImage src={getImageUrl(u?.avatar)} />
                  <AvatarFallback>{u?.full_name[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="text-sm font-medium">{u?.full_name}</div>
                  <div className="text-xs text-muted-foreground">
                    {u?.email}
                  </div>
                </div>
                {u?.admin ? (
                  <Badge variant="outline">Admin</Badge>
                ) : (
                  <Badge variant="outline">User</Badge>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
