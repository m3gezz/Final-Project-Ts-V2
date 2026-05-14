import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getImageUrl } from "@/lib/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { cancelRequest } from "@/api/functions/inbox";
import type { User } from "./UserCard";
import type { Workspace } from "./WorkspaceCard";

export type Request = {
  id: number;
  user: User;
  workspace: Workspace;
  type: "enter" | "leave";
  status: "pending" | "accepted" | "declined";
};

export default function UserSentRequestCard({ request }: { request: Request }) {
  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn: () => cancelRequest(request?.id),
    onMutate: () => {
      const previous = queryClient.getQueryData(["requests"]);
      queryClient.setQueryData(["requests"], (old) => [
        ...old.filter((r) => r.id != request?.id),
      ]);
      return { previous };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["requests"] });
    },
  });

  return (
    <div className="flex flex-wrap items-center gap-4 rounded-xl border bg-card p-4">
      <Avatar>
        <AvatarImage
          src={getImageUrl(request?.workspace?.project?.user?.avatar)}
        />
        <AvatarFallback>
          {request?.workspace?.project?.user?.full_name?.[0]}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <div className="text-sm">
          Request to{" "}
          <Link to={`/users/${request?.workspace?.project?.user?.id}`}>
            <span className="font-medium">
              {request?.workspace?.project?.user?.full_name}
            </span>
          </Link>{" "}
          for joining{" "}
          <Link
            to={`/projects/${request?.workspace?.project_id}`}
            className="font-medium"
          >
            {request?.workspace?.project?.title}
          </Link>
          's workspace
        </div>
        <div className="mt-1">
          <Badge variant="outline">{request?.status}</Badge>
        </div>
      </div>
      {request?.status === "pending" && (
        <Button size="sm" variant="outline" onClick={() => mutate()}>
          {isPending ? "Canceling" : "Cancel"}
        </Button>
      )}
    </div>
  );
}
