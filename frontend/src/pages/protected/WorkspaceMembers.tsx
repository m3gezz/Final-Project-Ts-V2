import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { useQuery } from "@tanstack/react-query";
import { getWorkspace } from "@/api/functions/workspace";
import InvitingModal from "@/components/modals/InvitingModal";
import WsMembersList from "@/components/lists/WsMembersList";
import ReceivedRequestList from "@/components/lists/ReceivedRequestsList";
import { useSelector } from "react-redux";

export default function WorkspaceMembers() {
  const { id } = useParams();
  const { user } = useSelector((state) => state?.auth);
  const { data: workspace, isLoading } = useQuery({
    queryKey: ["workspace", id, "members"],
    queryFn: () => getWorkspace(id, "members"),
  });
  const isAdmin = workspace?.memberships?.find(
    (m) =>
      m?.user_id === user?.id && (m?.role === "admin" || m?.role === "owner"),
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Members</h1>
        <Dialog>
          <DialogTrigger asChild>
            {isAdmin && (
              <Button>
                <UserPlus className="mr-2 h-4 w-4" />
                Invite
              </Button>
            )}
          </DialogTrigger>
          <InvitingModal />
        </Dialog>
      </div>

      <WsMembersList members={workspace?.memberships} isLoading={isLoading} />

      <div>
        <h2 className="mb-3 text-lg font-semibold">Requests & invitations</h2>
        <ReceivedRequestList
          requests={workspace?.requests}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
