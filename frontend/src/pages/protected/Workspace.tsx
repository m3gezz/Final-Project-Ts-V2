import { useParams } from "react-router-dom";
import { Progress } from "@/components/ui/progress";
import { useQuery } from "@tanstack/react-query";
import { getWorkspace } from "@/api/functions/workspaces";
import { Link } from "react-router-dom";
import WorkspaceSkeleton from "@/components/skeletons/WorkspaceSkeleton";
import { formatTime, getImageUrl } from "@/lib/utils";
import type { MembershipType, PopulatedTask } from "@/assets/types";
import { Badge } from "@/components/ui/badge";
import { Briefcase, List, UsersIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ProjectCard from "@/components/cards/ProjectCard";

export default function Workspace() {
  const { id } = useParams();
  const { data: workspace, isLoading } = useQuery({
    queryKey: ["workspace", id, "overview"],
    queryFn: () => getWorkspace(id, "overview"),
  });

  if (isLoading) return <WorkspaceSkeleton />;
  return (
    <section className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight flex items-center gap-2">
          <Briefcase className="h-6 w-6" />
          {workspace?.project?.title}'s Workspace
        </h1>
        <p className="text-sm text-muted-foreground">
          Project overview & activity
        </p>
      </header>
      <div className="grid gap-4 md:grid-cols-3">
        <Link
          to={`/projects/${workspace?.project?.id}`}
          className="group flex flex-col overflow-hidden rounded-xl border bg-card transition-all hover:-translate-y-0.5"
        >
          <div className="relative aspect-video overflow-hidden bg-muted">
            <img
              src={getImageUrl(workspace?.project?.image)}
              alt={workspace?.project?.title}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <Badge className="absolute left-3 top-3">
              {workspace?.project?.category?.label}
            </Badge>
            <div className="absolute bottom-0 left-0 p-4 backdrop-blur-xs w-full">
              <h3 className="font-semibold leading-tight group-hover:text-primary">
                {workspace?.project?.title}
              </h3>
              <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                {workspace?.project?.description}
              </p>
            </div>
          </div>
        </Link>
        <Link
          to={"tasks"}
          className="space-y-6 rounded-xl border bg-card p-4 hover:border-primary/50"
        >
          <div className="flex items-center justify-between text-sm">
            <div>
              <Badge>WORKFLOW</Badge>
              <h1 className="text-lg font-semibold mt-2">Open tasks</h1>
            </div>
            <div className="p-3 bg-muted rounded-full mb-3">
              <List className="h-6 w-6 text-primary" />
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-semibold mb-2">
              {workspace?.open_tasks_count ?? 0} open tasks
            </h1>
            <Progress value={workspace?.progress ?? 0} />
          </div>
          <p>{workspace?.progress ?? 0}% completion rate at this moment</p>
        </Link>
        <Link
          to={"members"}
          className="space-y-6 rounded-xl border bg-card p-4 hover:border-primary/50"
        >
          <div className="flex items-center justify-between text-sm">
            <div>
              <Badge>COLAB</Badge>
              <h1 className="text-lg font-semibold mt-2">Active Members</h1>
            </div>
            <div className="p-3 bg-muted rounded-full mb-3">
              <UsersIcon className="h-6 w-6 text-primary" />
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-semibold mb-2">
              {workspace?.memberships_count ?? 0} Online
            </h1>
            <div className="flex items-center gap-2">
              {workspace?.memberships?.map((m: MembershipType) => (
                <Avatar key={m?.id} className="h-6 w-6 -ml-2">
                  <AvatarImage src={getImageUrl(m?.user?.avatar)} />
                  <AvatarFallback>
                    {m?.user?.full_name?.[0]?.toLocaleUpperCase()}
                  </AvatarFallback>
                </Avatar>
              ))}
            </div>
          </div>
          <p>Syncing in 'Chat'</p>
        </Link>
      </div>
      <div className="rounded-xl border bg-card p-6">
        <h2 className="text-lg font-semibold">Recent activity</h2>
        <ul className="mt-4 space-y-3 text-sm">
          {workspace?.tasks?.length ? (
            workspace?.tasks?.map((t: PopulatedTask) => (
              <li key={t?.id} className="flex items-center gap-3">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                Task <i>"{t?.title}"</i> is{" "}
                {t?.status === "todo"
                  ? "assigned to"
                  : t?.status === "doing"
                    ? "advancing with"
                    : "done by"}{" "}
                <b>{t?.user?.full_name}</b>
                <span className="ml-auto text-xs text-muted-foreground">
                  {formatTime(t?.created_at)}
                </span>
              </li>
            ))
          ) : (
            <li className="flex items-center gap-3">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              No tasks history for now.
            </li>
          )}
        </ul>
      </div>
    </section>
  );
}
