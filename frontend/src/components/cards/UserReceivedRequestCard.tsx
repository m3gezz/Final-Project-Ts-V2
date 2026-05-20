import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatTime, getImageUrl } from "@/lib/utils";
import { Link } from "react-router-dom";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { RequestType } from "@/assets/types";
import { updateInvitation } from "@/api/functions/invitations";

export default function UserReceivedRequestCard({
  request,
}: {
  request: RequestType;
}) {
  const queryClient = useQueryClient();
  const {
    mutate: updateInvitationMutation,
    isPending: isUpdateInvitationPending,
  } = useMutation({
    mutationFn: (data: { status: "accepted" | "declined" }) =>
      updateInvitation(request?.id, data),
    onMutate: () => {
      queryClient.cancelQueries();
      const previous = queryClient.getQueryData(["invitations"]);
      queryClient.setQueryData(["invitations"], (old: RequestType[]) => [
        ...old?.filter((r) => r?.id != request?.id),
      ]);

      return { previous };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["invitations"],
      });
    },
  });

  return (
    <div className="flex flex-wrap items-center gap-4 rounded-xl border bg-card p-4">
      <Avatar>
        <AvatarImage src={getImageUrl(request?.user?.avatar)} />
        <AvatarFallback>{request?.user?.full_name?.[0]}</AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <div className="text-sm">
          Invitation from
          <Link
            to={`/projects/${request?.workspace?.project?.id}`}
            className="font-medium"
          >
            {request?.workspace?.project?.title}
          </Link>
          to join their workspace.
        </div>
        <div className="mt-1 space-x-2">
          <Badge variant="outline">{request?.status}</Badge>
          <span className="text-xs text-muted-foreground">
            {formatTime(request?.created_at)}
          </span>
        </div>
      </div>
      {request?.status === "pending" && (
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            disabled={isUpdateInvitationPending}
            onClick={() => updateInvitationMutation({ status: "declined" })}
          >
            <X className="mr-1 h-4 w-4" />
            Decline
          </Button>
          <Button
            size="sm"
            disabled={isUpdateInvitationPending}
            onClick={() => updateInvitationMutation({ status: "accepted" })}
          >
            <Check className="mr-1 h-4 w-4" />
            Accept
          </Button>
        </div>
      )}
    </div>
  );
}
