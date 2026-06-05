import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatTime, getImageUrl } from "@/lib/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { destroyRequest } from "@/api/functions/requests";
import type { RequestType } from "@/assets/types";

export default function UserSentRequestCard({
  request,
}: {
  request: RequestType;
}) {
  const queryClient = useQueryClient();
  const { mutate: destroyRequestMutation, isPending: isDestroyRequestPending } =
    useMutation({
      mutationFn: () => destroyRequest(request?.id),
      onMutate: () => {
        queryClient.cancelQueries();
        const previous = queryClient.getQueryData(["requests"]);
        queryClient.setQueryData(["requests"], (old: RequestType[]) => [
          ...old?.filter((r) => r?.id != request?.id),
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
        <div className="mt-1 space-x-2">
          <Badge variant="outline">{request?.status}</Badge>
          <span className="text-xs text-muted-foreground">
            {formatTime(request?.created_at)}
          </span>
        </div>
      </div>
      {request?.status === "pending" && (
        <Button
          size="sm"
          variant="destructive"
          disabled={isDestroyRequestPending}
          onClick={() => destroyRequestMutation()}
        >
          {isDestroyRequestPending ? "Canceling" : "Cancel"}
        </Button>
      )}
    </div>
  );
}
