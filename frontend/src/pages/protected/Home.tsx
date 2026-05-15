import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Plus, FolderKanban, Briefcase, Inbox } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getHome } from "@/api/functions/user";
import ProjectsList from "@/components/lists/ProjectsList";
import WorkspacesList from "@/components/lists/WorkspacesList";

export default function Home() {
  const { data, isLoading } = useQuery({
    queryKey: ["home"],
    queryFn: getHome,
    staleTime: 1000 * 60 * 10,
  });

  return (
    <div className="space-y-10">
      <div className="bg-muted overflow-hidden rounded-2xl border p-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Welcome back,</p>
            <h1 className="text-3xl font-semibold tracking-tight">
              {data?.user?.full_name?.split(" ")?.[0]}
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
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {[
            {
              icon: FolderKanban,
              label: "Projects",
              value: data?.user?.projects_count ?? 0,
              to: "/projects",
            },
            {
              icon: Briefcase,
              label: "Workspaces",
              value: data?.user?.workspaces_count ?? 0,
              to: "/workspaces",
            },
            {
              icon: Inbox,
              label: "Pending invites",
              value: data?.user?.requests_count ?? 0,
              to: "/inbox",
            },
          ].map((s) => (
            <Link
              key={s.label}
              to={s.to}
              className="flex items-center gap-4 rounded-xl border bg-card p-4 hover:border-primary/50"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                <s.icon className="h-5 w-5" />
              </div>
              <div>
                <div className="text-2xl font-semibold">{s.value}</div>
                <div className="text-xs text-muted-foreground">{s.label}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <section>
        <div className="mb-4 flex items-end justify-between">
          <h2 className="text-xl font-semibold">Your workspaces</h2>
          <Button asChild variant="ghost" size="sm">
            <Link to="/workspaces">
              View all <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>
        <WorkspacesList workspaces={data?.workspaces} isLoading={isLoading} />
      </section>

      <section>
        <div className="mb-4 flex items-end justify-between">
          <h2 className="text-xl font-semibold">Trending projects</h2>
          <Button asChild variant="ghost" size="sm">
            <Link to="/projects">
              Browse all <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>
        <ProjectsList projects={data?.projects} isLoading={isLoading} />
      </section>
    </div>
  );
}
