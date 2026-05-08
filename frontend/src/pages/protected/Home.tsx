import { Link } from "react-router-dom";
import { useAuth } from "@/app/AuthContext";
import { projects, workspaces } from "@/app/mock-data";
import ProjectCard from "@/components/cards/ProjectCard";
import WorkspaceCard from "@/components/cards/WorkspaceCard";
import { Button } from "@/components/ui/button";
import { ArrowRight, Plus, FolderKanban, Briefcase, Inbox } from "lucide-react";

export default function Home() {
  const { user } = useAuth();
  return (
    <div className="space-y-10">
      <div
        className="overflow-hidden rounded-2xl border p-8"
        style={{
          background: "var(--gradient-soft)",
          boxShadow: "var(--shadow-soft)",
        }}
      >
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Welcome back,</p>
            <h1 className="text-3xl font-semibold tracking-tight">
              {user?.full_name?.split(" ")[0]} 👋
            </h1>
            <p className="mt-1 text-muted-foreground">
              Here's what's happening across your projects today.
            </p>
          </div>
          <div className="flex gap-2">
            <Button asChild>
              <Link to="/projects/new">
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
              value: projects.length,
              to: "/projects",
            },
            {
              icon: Briefcase,
              label: "Workspaces",
              value: workspaces.length,
              to: "/workspaces",
            },
            { icon: Inbox, label: "Pending invites", value: 1, to: "/inbox" },
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
        <div className="grid gap-4 md:grid-cols-2">
          {workspaces.map((w) => (
            <WorkspaceCard key={w.id} workspace={w} />
          ))}
        </div>
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
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.slice(0, 3).map((p) => (
            <ProjectCard key={p.id} project={p} />
          ))}
        </div>
      </section>
    </div>
  );
}
