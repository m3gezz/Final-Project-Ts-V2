import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LetterTextIcon, ShieldCheck, UserPlus, UsersIcon } from "lucide-react";
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
  const { data: workspace, isLoading } = useQuery({
    queryKey: ["workspace", id, "members"],
    queryFn: () => getWorkspace(id, "members"),
  });

  const stats = [
    {
      icon: UsersIcon,
      label: "Active members",
      value: workspace?.memberships?.length ?? "-",
    },
    {
      icon: LetterTextIcon,
      label: "Sent invitations",
      value: workspace?.invitations?.length ?? "-",
    },
    {
      icon: ShieldCheck,
      label: "Received requests",
      value: workspace?.requests?.length ?? "-",
    },
    {
      icon: ShieldCheck,
      label: "Admins",
      value:
        workspace?.memberships?.filter(
          (m: MembershipType) => m?.role === "admin" || m?.role === "owner",
        ).length ?? "-",
    },
  ];

  const isAdmin = workspace?.memberships?.find(
    (m: MembershipType) =>
      m?.user_id === user?.id && (m?.role === "admin" || m?.role === "owner"),
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold flex items-center gap-2">
          <UsersIcon className=" h-6 w-6" /> Members
        </h1>

        {isAdmin && (
          <Button
            size="lg"
            onClick={() => disp(toggleModal({ name: "isCreateInvite" }))}
          >
            <UserPlus className="mr-2 h-4 w-4" />
            Invite
          </Button>
        )}
        <InvitingModal />
      </div>

      <section className="grid gap-4 md:grid-cols-4">
        {stats?.map((s, i) => (
          <div
            key={i}
            className="flex items-center gap-4 p-4 bg-input rounded-lg"
          >
            <div className="p-3 bg-muted rounded-full">
              <s.icon className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">{s?.value}</h2>
              <p className="text-muted-foreground">{s?.label}</p>
            </div>
          </div>
        ))}
      </section>
      <h1 className="text-lg font-semibold">Members list</h1>
      <WsMembersList members={workspace?.memberships} isLoading={isLoading} />

      <h1 className="text-lg font-semibold">Requests / Invitations list</h1>
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
