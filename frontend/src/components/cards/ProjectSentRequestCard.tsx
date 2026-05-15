import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getImageUrl } from "@/lib/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Request } from "./UserSentRequestCard";
import { cancelInvitation } from "@/api/functions/inbox";
import { useSelector } from "react-redux";

export default function ProjectSentRequestCard({
  request,
}: {
  request: Request;
}) {
  const queryClient = useQueryClient();
  const { user } = useSelector((state) => state?.auth);
  const previous = queryClient.getQueryData([
    "workspace",
    String(request?.workspace_id),
    "members",
  ]);
  const isOwner = user?.id === previous?.project?.user_id;
  const { mutate, isPending } = useMutation({
    mutationFn: () => cancelInvitation(request?.id),
    onMutate: () => {
      const previous = queryClient.getQueryData([
        "workspace",
        String(request?.workspace_id),
        "members",
      ]);
      queryClient.setQueryData(
        ["workspace", String(request?.workspace_id), "members"],
        (old) => ({
          ...old,
          invitations: [...old.invitations.filter((r) => r.id != request?.id)],
        }),
      );

      return { previous };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["workspace", String(request?.workspace_id), "members"],
      });
      queryClient.invalidateQueries({
        queryKey: ["workspace", String(id), "overview"],
      });
    },
  });

  return (
    <div className="flex flex-wrap items-center gap-4 rounded-xl border bg-card p-4">
      <Avatar>
        <AvatarImage src={getImageUrl(request?.receiver?.avatar)} />
        <AvatarFallback>{request?.receiver?.full_name?.[0]}</AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <div className="text-sm">
          Requesting{" "}
          <Link to={`/users/${request?.receiver?.id}`}>
            <span className="font-medium">{request?.receiver?.full_name}</span>
          </Link>{" "}
          to join this workspace
        </div>
        <div className="mt-1">
          <Badge variant="outline">{request?.status}</Badge>
        </div>
      </div>
      {request?.status === "pending" && isOwner && (
        <Button size="sm" variant="outline" onClick={() => mutate()}>
          {isPending ? "Canceling" : "Cancel"}
        </Button>
      )}
    </div>
  );
}
