import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatTime, getImageUrl } from "@/lib/utils";
import { Link } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { PopulatedWorkspace, RequestType } from "@/assets/types";
import { updateRequest } from "@/api/functions/requests";
import { useAppSelector } from "@/redux/store";

export default function ProjectReceivedRequestCard({
  request,
}: {
  request: RequestType;
}) {
  const queryClient = useQueryClient();
  const { user } = useAppSelector((state) => state?.auth);
  const previous: PopulatedWorkspace | undefined = queryClient.getQueryData([
    "workspace",
    String(request?.workspace_id),
    "members",
  ]);
  const isOwner = user?.id === previous?.project?.user_id;
  const { mutate: updateRequestMutation, isPending: isUpdateRequestPending } =
    useMutation({
      mutationFn: (data: { status: "accepted" | "declined" }) =>
        updateRequest(request?.id, data),
      onMutate: (data) => {
        queryClient.cancelQueries();
        const previous = queryClient.getQueryData([
          "workspace",
          String(request?.workspace_id),
          "members",
        ]);

        if (data?.status === "declined") {
          queryClient.setQueryData(
            ["workspace", String(request?.workspace_id), "members"],
            (old: PopulatedWorkspace) => ({
              ...old,
              requests: [...old?.requests?.filter((r) => r?.id != request?.id)],
            }),
          );
          return { previous };
        }

        queryClient.setQueryData(
          ["workspace", String(request?.workspace_id), "members"],
          (old: PopulatedWorkspace) => ({
            ...old,
            memberships: [
              ...old?.memberships,
              {
                id: Date.now(),
                role: "member",
                user: request?.user,
                user_id: request?.user?.id,
                workspace_id: request?.workspace?.id,
              },
            ],
            requests: [...old?.requests?.filter((r) => r?.id != request?.id)],
          }),
        );

        return { previous };
      },
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["workspace", String(request?.workspace_id), "members"],
        });
        queryClient.invalidateQueries({
          queryKey: ["workspace", String(request?.workspace_id), "overview"],
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
          <Link
            to={`/users/${request?.user?.id}`}
            className="font-medium text-accent"
          >
            {request?.user?.full_name}
          </Link>{" "}
          Wants to join
        </div>
        <div className="mt-1 space-x-2">
          <Badge variant="outline" className="border-yellow-400/50">
            {request?.status}
          </Badge>
          <span className="text-xs text-muted-foreground">
            {formatTime(request?.created_at)}
          </span>
        </div>
      </div>
      {request?.status === "pending" && isOwner && (
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="destructive"
            disabled={isUpdateRequestPending}
            onClick={() => updateRequestMutation({ status: "declined" })}
          >
            <X className="mr-1 h-4 w-4" />
            Decline
          </Button>
          <Button
            size="sm"
            disabled={isUpdateRequestPending}
            onClick={() => updateRequestMutation({ status: "accepted" })}
          >
            <Check className="mr-1 h-4 w-4" />
            Accept
          </Button>
        </div>
      )}
    </div>
  );
}
