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
import type { User } from "./UserCard";
import { useSelector } from "react-redux";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteMember, updateMemberRole } from "@/api/functions/workspace";

export type Member = {
  user: User;
  role: string;
};

export default function WsMemberCard({ member }: { member: Member }) {
  const { user } = useSelector((state) => state?.auth);
  const queryClient = useQueryClient();
  const previous = queryClient.getQueryData([
    "workspace",
    String(member?.workspace_id),
    "members",
  ]);
  const isOwner = user?.id === previous?.project?.user_id;

  const { mutate } = useMutation({
    mutationFn: () => deleteMember(member?.id),
    onMutate: () => {
      const previous = queryClient.getQueryData([
        "workspace",
        String(member?.workspace_id),
        "members",
      ]);

      queryClient.setQueryData(
        ["workspace", String(member?.workspace_id), "members"],
        (old) => ({
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

  const { mutate: updateRole, isPending: isPendingUpdate } = useMutation({
    mutationFn: (data: { role: string }) => updateMemberRole(member?.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["workspace", String(member?.workspace_id), "members"],
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
        onValueChange={(v) => updateRole({ role: v })}
        disabled={!isOwner || member?.role === "owner" || isPendingUpdate}
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
        <Button variant="ghost" size="icon" onClick={() => mutate()}>
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
