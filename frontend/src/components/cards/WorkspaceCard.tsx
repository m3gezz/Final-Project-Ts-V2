import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getImageUrl } from "@/lib/utils";
import type { PopulatedWorkspace } from "@/assets/types";
import { Progress } from "../ui/progress";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { ChevronRight } from "lucide-react";

export default function WorkspaceCard({
  workspace,
}: {
  workspace: PopulatedWorkspace;
}) {
  return (
    <article className="group flex flex-col justify-between gap-4 rounded-xl border bg-card p-4 transition-all hover:-translate-y-0.5">
      <div className="flex items-start justify-between">
        <img
          src={getImageUrl(workspace?.project?.image)}
          alt={workspace?.project?.title}
          className="w-12 h-12 rounded-md"
        />

        <Badge>{workspace?.project?.category?.label}</Badge>
      </div>
      <div>
        <h3 className="font-semibold group-hover:text-primary">
          {workspace?.project?.title}'s Workspace
        </h3>
        <p className="line-clamp-2 text-sm text-muted-foreground">
          {workspace?.project?.description}
        </p>
      </div>
      <div className="my-1 space-y-1">
        <div className="flex items-center justify-between">
          <span>Overall progress</span>
          <span>{workspace?.progress ?? 0}%</span>
        </div>
        <Progress value={workspace?.progress ?? 0} />
      </div>
      <div className="flex items-center justify-between">
        <div className="flex -space-x-2">
          {workspace?.memberships?.slice(0, 5)?.map((m) => {
            return (
              <Avatar key={m?.user?.id} className="h-6 w-6 ring-2 ring-card">
                <AvatarImage src={getImageUrl(m?.user?.avatar)} />
                <AvatarFallback>{m?.user?.full_name?.[0]}</AvatarFallback>
              </Avatar>
            );
          })}
        </div>
        <Button asChild variant={"link"} className="text-xs">
          <Link to={`/workspaces/${workspace?.id}`}>
            VIEW WORKSPACE <ChevronRight />
          </Link>
        </Button>
      </div>
    </article>
  );
}
