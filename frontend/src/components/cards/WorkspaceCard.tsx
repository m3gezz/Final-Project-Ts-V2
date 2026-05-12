import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getImageUrl } from "@/lib/utils";
import { Badge } from "../ui/badge";

export default function WorkspaceCard({ project }) {
  return (
    <Link
      to={`/workspaces/${project?.workspace?.id}`}
      className="group flex flex-col gap-4 rounded-xl border bg-card p-5 transition-all hover:-translate-y-0.5"
      style={{ boxShadow: "var(--shadow-soft)" }}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <Badge
            variant={
              project?.workspace?.status === "on_hold" ? "secondary" : "default"
            }
          >
            {project?.workspace?.status === "on_hold" ? "On Hold" : "Active"}
          </Badge>
          <div className="text-xs text-muted-foreground">
            {project?.category?.label}
          </div>
          <h3 className="mt-0.5 font-semibold group-hover:text-primary">
            {project?.title}'s Workspace
          </h3>
        </div>
        <div className="h-10 w-10 overflow-hidden rounded-lg bg-muted">
          {project && (
            <img
              src={getImageUrl(project?.image)}
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
          {project?.members?.slice(0, 4)?.map((m) => {
            return (
              <Avatar key={m?.user_id} className="h-7 w-7 ring-2 ring-card">
                <AvatarImage src={getImageUrl(m?.user?.avatar)} />
                <AvatarFallback>{m?.user?.full_name?.[0]}</AvatarFallback>
              </Avatar>
            );
          })}
        </div>
        <span className="text-xs text-muted-foreground">
          {project?.members?.length} members
        </span>
      </div>
    </Link>
  );
}
