import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { Button } from "../ui/button";
import { getImageUrl } from "@/lib/utils";
import { Link, useParams } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createInvitation } from "@/api/functions/invitations";
import type { PopulatedWorkspace, UserType } from "@/assets/types";
import { useAppDispatch } from "@/redux/store";
import { toggleModal } from "@/redux/modalSlice";

export default function InvitingUserCard({ user }: { user: UserType }) {
  const { id } = useParams();
  const disp = useAppDispatch();
  const queryClient = useQueryClient();
  const {
    mutate: createInvitationMutation,
    isPending: isCreateInvitationLoading,
  } = useMutation({
    mutationFn: () =>
      createInvitation({
        workspace_id: id,
        user_id: user?.id,
      }),
    onMutate: () => {
      disp(toggleModal(false));
      queryClient.cancelQueries();
      const previous = queryClient.getQueryData([
        "workspace",
        String(id),
        "members",
      ]);

      queryClient.setQueryData(
        ["workspace", String(id), "members"],
        (old: PopulatedWorkspace) => ({
          ...old,
          invitations: [
            ...old.invitations,
            {
              id: Date.now(),
              workspace_id: id,
              user_id: user?.id,
              user,
              status: "pending",
              created_at: new Date(),
            },
          ],
        }),
      );

      return { previous };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["workspace", String(id), "members"],
      });
      queryClient.invalidateQueries({
        queryKey: ["workspace", String(id), "overview"],
      });
    },
  });

  return (
    <div className="flex items-center gap-3 rounded-lg p-2 hover:bg-muted">
      <Avatar className="h-8 w-8">
        <AvatarImage src={getImageUrl(user?.avatar)} />
        <AvatarFallback>{user?.full_name?.[0]}</AvatarFallback>
      </Avatar>
      <Link className="flex-1 text-sm" to={`/users/${user?.id}`}>
        <div className="font-medium">{user?.full_name}</div>
        <div className="text-xs text-muted-foreground">@{user?.username}</div>
      </Link>
      <Button
        size="sm"
        variant="outline"
        onClick={() => createInvitationMutation()}
        disabled={isCreateInvitationLoading}
      >
        Invite
      </Button>
    </div>
  );
}
