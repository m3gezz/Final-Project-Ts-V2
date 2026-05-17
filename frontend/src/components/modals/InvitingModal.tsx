import {
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getUsers } from "@/api/functions/users";
import { useForm } from "react-hook-form";
import { useState } from "react";
import InputController from "../controllers/InputController";
import InvitingUsersList from "../lists/InvitingUsersList";
import { useParams } from "react-router-dom";
import type {
  PaginationState,
  PopulatedWorkspace,
  UserType,
} from "@/assets/types";

export default function InvitingModal() {
  const { id } = useParams();
  const [pagination, setPagination] = useState<PaginationState>({
    current_page: 1,
    last_page: 1,
    to: 0,
    total: 0,
  });
  const form = useForm({
    defaultValues: {
      search: "",
    },
  });
  const search = form.watch("search");
  const { data: users, isFetching } = useQuery({
    queryKey: ["users", pagination.current_page, search],
    queryFn: () =>
      getUsers({
        pagination,
        setPagination,
        search,
      }),
  });

  const queryClient = useQueryClient();
  const previous: PopulatedWorkspace | undefined = queryClient.getQueryData([
    "workspace",
    String(id),
    "members",
  ]);
  const membersIds = previous?.memberships?.map((m) => m?.user?.id);

  return (
    <DialogContent aria-describedby="">
      <DialogHeader>
        <DialogTitle>Invite to workspace</DialogTitle>
      </DialogHeader>
      <div className="space-y-3">
        <InputController control={form.control} f={{ name: "search" }} />
        <InvitingUsersList
          users={[
            ...(users ?? []).filter(
              (u: UserType) => !membersIds?.includes(u.id),
            ),
          ]}
          isLoading={isFetching}
        />
      </div>
    </DialogContent>
  );
}
