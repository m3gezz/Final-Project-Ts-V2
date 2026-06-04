import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Plus, FolderKanban, Briefcase, Inbox } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import ProjectsList from "@/components/lists/ProjectsList";
import WorkspacesList from "@/components/lists/WorkspacesList";
import { userDashboard } from "@/api/functions/users";
import { useAppSelector } from "@/redux/store";
import FeedList from "@/components/lists/FeedList";

export default function Home() {
  const { user } = useAppSelector((state) => state?.auth);
  const { data, isLoading: isUserDashboardLoading } = useQuery({
    queryKey: ["userDashboard"],
    queryFn: () => userDashboard(),
  });

  const userData = [
    {
      icon: FolderKanban,
      label: "Projects",
      value: data?.counts?.projects ?? "-",
      to: "/projects",
    },
    {
      icon: Briefcase,
      label: "Workspaces",
      value: data?.counts?.workspaces ?? "-",
      to: "/workspaces",
    },
    {
      icon: Inbox,
      label: "Pending invites",
      value: data?.counts?.requests ?? "-",
      to: "/inbox",
    },
  ];

  return (
    <div className="space-y-10">
      <section className="grid lg:grid-cols-[5fr_2fr] gap-4">
        <article className="bg-muted overflow-hidden rounded-2xl border p-8 flex flex-col justify-between">
          <section className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Welcome back,</p>
              <h1 className="text-3xl font-semibold tracking-tight">
                {user?.full_name?.split(" ")?.[0]}
              </h1>
              <p className="mt-1 text-muted-foreground">
                Here's what's happening across your projects today.
              </p>
            </div>
            <div className="flex gap-2">
              <Button asChild>
                <Link to="/create-project">
                  <Plus className="mr-2 h-4 w-4" />
                  New project
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="/projects">Explore</Link>
              </Button>
            </div>
          </section>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {userData?.map((ud) => (
              <Link
                key={ud?.label}
                to={ud?.to}
                className="flex items-center gap-4 rounded-xl border bg-card p-4 hover:border-primary/50"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted text-accent">
                  <ud.icon className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-2xl font-semibold">{ud?.value}</div>
                  <div className="text-xs text-muted-foreground">
                    {ud?.label}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </article>
        <FeedList tasks={data?.tasks} isLoading={isUserDashboardLoading} />
      </section>

      <section>
        <div className="mb-4 flex items-end justify-between">
          <h2 className="text-xl font-semibold">Your workspaces</h2>
          <Button asChild variant="link" size="sm">
            <Link to="/workspaces">
              View all <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>
        <WorkspacesList
          workspaces={data?.workspaces}
          isLoading={isUserDashboardLoading}
        />
      </section>

      <section>
        <div className="mb-4 flex items-end justify-between">
          <h2 className="text-xl font-semibold">Trending projects</h2>
          <Button asChild variant="link" size="sm">
            <Link to="/projects">
              Browse all <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>
        <ProjectsList
          projects={data?.projects}
          isLoading={isUserDashboardLoading}
        />
      </section>
    </div>
  );
}
