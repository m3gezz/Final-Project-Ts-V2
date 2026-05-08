import { Link } from "react-router-dom";
import { type Workspace, findUser, findProject } from "@/data/exp";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function WorkspaceCard({ workspace }: { workspace: Workspace }) {
  const project = findProject(workspace.projectId);
  return (
    <Link
      to={`/workspaces/${workspace.id}`}
      className="group flex flex-col gap-4 rounded-xl border bg-card p-5 transition-all hover:-translate-y-0.5"
      style={{ boxShadow: "var(--shadow-soft)" }}
    >
      <div className="flex items-start justify-between">
        <div>
          <div className="text-xs text-muted-foreground">
            {project?.category}
          </div>
          <h3 className="mt-0.5 font-semibold group-hover:text-primary">
            {workspace.name}
          </h3>
        </div>
        <div className="h-10 w-10 overflow-hidden rounded-lg bg-muted">
          {project && (
            <img
              src={project.image}
              alt=""
              className="h-full w-full object-cover"
            />
          )}
        </div>
      </div>
      <p className="line-clamp-2 text-sm text-muted-foreground">
        {project?.description}
      </p>
      <div className="flex items-center justify-between">
        <div className="flex -space-x-2">
          {workspace.members.slice(0, 4).map((m) => {
            const u = findUser(m.userId);
            return (
              <Avatar key={m.userId} className="h-7 w-7 ring-2 ring-card">
                <AvatarImage src={u.avatar} />
                <AvatarFallback>{u.full_name[0]}</AvatarFallback>
              </Avatar>
            );
          })}
        </div>
        <span className="text-xs text-muted-foreground">
          {workspace.members.length} members
        </span>
      </div>
    </Link>
  );
}
