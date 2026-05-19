import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getImageUrl } from "@/lib/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { MembershipType, PopulatedWorkspace } from "@/assets/types";
import { destroyMember, updateMember } from "@/api/functions/workspaces";
import { useAppSelector } from "@/redux/store";

export default function WsMemberCard({ member }: { member: MembershipType }) {
  const { user } = useAppSelector((state) => state?.auth);
  const queryClient = useQueryClient();
  const previous: PopulatedWorkspace | undefined = queryClient.getQueryData([
    "workspace",
    String(member?.workspace_id),
    "members",
  ]);
  const isOwner = user?.id === previous?.project?.user_id;

  const { mutate: destroyMemberMutation, isPending: isDestroyMemberPending } =
    useMutation({
      mutationFn: () => destroyMember(member?.id),
      onMutate: () => {
        queryClient.cancelQueries();
        const previous = queryClient.getQueryData([
          "workspace",
          String(member?.workspace_id),
          "members",
        ]);

        queryClient.setQueryData(
          ["workspace", String(member?.workspace_id), "members"],
          (old: PopulatedWorkspace) => ({
            ...old,
            memberships: [
              ...old?.memberships?.filter((m) => m?.id != member?.id),
            ],
          }),
        );

        return { previous };
      },
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["workspace", String(member?.workspace_id), "members"],
        });
      },
    });

  const { mutate: updateMemberMutation, isPending: isUpdateMemberPending } =
    useMutation({
      mutationFn: (data: { role: string }) => updateMember(member?.id, data),
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["workspace", String(member?.workspace_id), "members"],
        });
        queryClient.invalidateQueries({
          queryKey: ["workspace", String(member?.workspace_id), "overview"],
        });
        queryClient.invalidateQueries({
          queryKey: ["workspace", String(member?.workspace_id), "tasks"],
        });
      },
    });

  return (
    <div className="flex items-center gap-4 border-b p-4 last:border-b-0">
      <Avatar>
        <AvatarImage src={getImageUrl(member?.user?.avatar)} />
        <AvatarFallback>{member?.user?.full_name?.[0]}</AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <div className="font-medium">{member?.user?.full_name}</div>
        <div className="text-xs text-muted-foreground">
          @{member?.user?.username}
        </div>
      </div>
      <Select
        defaultValue={member?.role}
        onValueChange={(v) => updateMemberMutation({ role: v })}
        disabled={!isOwner || member?.role === "owner" || isUpdateMemberPending}
      >
        <SelectTrigger className="w-32">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {member?.role === "owner" && (
            <SelectItem value="owner">Owner</SelectItem>
          )}
          <SelectItem value="admin">Admin</SelectItem>
          <SelectItem value="member">Member</SelectItem>
        </SelectContent>
      </Select>
      {member?.role !== "owner" && isOwner && (
        <Button
          variant="ghost"
          size="icon"
          disabled={isDestroyMemberPending}
          onClick={() => destroyMemberMutation()}
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
