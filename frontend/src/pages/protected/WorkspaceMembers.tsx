import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { getWorkspace } from "@/api/functions/workspaces";
import InvitingModal from "@/components/modals/InvitingModal";
import WsMembersList from "@/components/lists/WsMembersList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import SentRequestsList from "@/components/lists/SentRequestsList";
import ReceivedRequestsList from "@/components/lists/ReceivedRequestsList";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import type { MembershipType } from "@/assets/types";
import { toggleModal } from "@/redux/modalSlice";

export default function WorkspaceMembers() {
  const { id } = useParams();
  const disp = useAppDispatch();
  const { user } = useAppSelector((state) => state?.auth);
  const { open } = useAppSelector((state) => state?.modal);
  const { data: workspace, isLoading } = useQuery({
    queryKey: ["workspace", id, "members"],
    queryFn: () => getWorkspace(id, "members"),
  });

  const isAdmin = workspace?.memberships?.find(
    (m: MembershipType) =>
      m?.user_id === user?.id && (m?.role === "admin" || m?.role === "owner"),
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Members</h1>
        <Dialog open={open} onOpenChange={(v) => disp(toggleModal(v))}>
          {isAdmin && (
            <DialogTrigger asChild>
              <Button>
                <UserPlus className="mr-2 h-4 w-4" />
                Invite
              </Button>
            </DialogTrigger>
          )}
          <InvitingModal />
        </Dialog>
      </div>

      <WsMembersList members={workspace?.memberships} isLoading={isLoading} />
      <Tabs defaultValue="requests" className="flex flex-col">
        <TabsList className="p-1">
          <TabsTrigger value="requests">
            Sent ({workspace?.invitations?.length ?? 0})
          </TabsTrigger>
          <TabsTrigger value="invitations">
            Received ({workspace?.requests?.length ?? 0})
          </TabsTrigger>
        </TabsList>
        <TabsContent value="requests">
          <SentRequestsList
            type="workspace"
            requests={workspace?.invitations}
            isLoading={isLoading}
          />
        </TabsContent>

        <TabsContent value="invitations">
          <ReceivedRequestsList
            type="workspace"
            requests={workspace?.requests}
            isLoading={isLoading}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
