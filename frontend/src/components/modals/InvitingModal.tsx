import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import InputController from "../controllers/InputController";
import InvitingUsersList from "../lists/InvitingUsersList";
import { useParams } from "react-router-dom";
import { getNonMembers } from "@/api/functions/workspaces";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { toggleModal } from "@/redux/modalSlice";

export default function InvitingModal() {
  const { id } = useParams();
  const disp = useAppDispatch();
  const { isCreateInvite } = useAppSelector((state) => state?.modal);

  const form = useForm({
    defaultValues: {
      search: "",
    },
  });
  const search = form.watch("search");
  const { data: nonMembers, isFetching: isNonMembersFetching } = useQuery({
    queryKey: ["nonMembers", search, id],
    queryFn: () =>
      getNonMembers({
        search,
        workspace_id: id,
      }),
  });

  return (
    <Dialog
      open={isCreateInvite}
      onOpenChange={() => disp(toggleModal({ name: "isCreateInvite" }))}
    >
      <DialogContent aria-describedby="">
        <DialogHeader>
          <DialogTitle>Invite to workspace</DialogTitle>
          <DialogDescription>
            Invite new members to this workspace.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <InputController control={form.control} f={{ name: "search" }} />
          <InvitingUsersList
            users={nonMembers}
            isLoading={isNonMembersFetching}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
