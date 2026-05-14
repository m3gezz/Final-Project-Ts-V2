import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getImageUrl } from "@/lib/utils";
import { Link } from "react-router-dom";
import type { Request } from "./UserSentRequestCard";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { modifyInvitation } from "@/api/functions/inbox";

export default function UserReceivedRequestCard({
  request,
}: {
  request: Request;
}) {
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: (data: { status: string }) =>
      modifyInvitation(request?.id, data),
    onMutate: () => {
      const previous = queryClient.getQueryData(["invitations"]);
      queryClient.setQueryData(["invitations"], (old) => [
        ...old.filter((r) => r.id != request?.id),
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
          <Link to={`/users/${request?.user?.id}`} className="font-medium">
            {request?.user?.full_name}
          </Link>{" "}
          Wants you to join{" "}
          <Link
            to={`/projects/${request?.workspace?.project?.id}`}
            className="font-medium"
          >
            {request?.workspace?.project?.title}
          </Link>
        </div>
        <div className="mt-1">
          <Badge variant="outline">{request?.status}</Badge>
        </div>
      </div>
      {request?.status === "pending" && (
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => mutate({ status: "declined" })}
          >
            <X className="mr-1 h-4 w-4" />
            Decline
          </Button>
          <Button size="sm" onClick={() => mutate({ status: "accepted" })}>
            <Check className="mr-1 h-4 w-4" />
            Accept
          </Button>
        </div>
      )}
    </div>
  );
}
