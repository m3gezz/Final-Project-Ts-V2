import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getImageUrl } from "@/lib/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { PopulatedWorkspace, RequestType } from "@/assets/types";
import { destroyInvitation } from "@/api/functions/invitations";
import { useAppSelector } from "@/redux/store";

export default function ProjectSentRequestCard({
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
  const {
    mutate: destroyInvitationMutation,
    isPending: isDestroyInvitationPending,
  } = useMutation({
    mutationFn: () => destroyInvitation(request?.id),
    onMutate: () => {
      const previous = queryClient.getQueryData([
        "workspace",
        String(request?.workspace_id),
        "members",
      ]);
      queryClient.setQueryData(
        ["workspace", String(request?.workspace_id), "members"],
        (old: PopulatedWorkspace) => ({
          ...old,
          invitations: [
            ...old?.invitations?.filter((r) => r?.id != request?.id),
          ],
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
          Requesting{" "}
          <Link to={`/users/${request?.user?.id}`}>
            <span className="font-medium">{request?.user?.full_name}</span>
          </Link>{" "}
          to join this workspace
        </div>
        <div className="mt-1">
          <Badge variant="outline">{request?.status}</Badge>
        </div>
      </div>
      {request?.status === "pending" && isOwner && (
        <Button
          size="sm"
          variant="outline"
          disabled={isDestroyInvitationPending}
          onClick={() => destroyInvitationMutation()}
        >
          {isDestroyInvitationPending ? "Canceling" : "Cancel"}
        </Button>
      )}
    </div>
  );
}
