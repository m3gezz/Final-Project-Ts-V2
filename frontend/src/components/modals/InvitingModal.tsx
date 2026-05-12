import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useQuery } from "@tanstack/react-query";
import { getUsers } from "@/api/functions/user";
import { useForm } from "react-hook-form";
import { useState } from "react";
import InputController from "../controllers/InputController";
import { getImageUrl } from "@/lib/utils";
import InvitingUserCard from "../cards/InvitingUserCard";
import InvitingUsersList from "../lists/InvitingUsersList";

export default function InvitingModal() {
  const [pagination, setPagination] = useState({
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
        skill_id: 0,
        sort: 1,
      }),
  });

  return (
    <DialogContent aria-describedby="">
      <DialogHeader>
        <DialogTitle>Invite to workspace</DialogTitle>
      </DialogHeader>
      <div className="space-y-3">
        <InputController control={form.control} f={{ name: "search" }} />
        <InvitingUsersList users={users} isLoading={isFetching} />
      </div>
    </DialogContent>
  );
}
