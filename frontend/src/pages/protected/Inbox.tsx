import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Header from "@/components/slices/Header";
import { useQueries } from "@tanstack/react-query";
import SentRequestsList from "@/components/lists/SentRequestsList";
import ReceivedRequestsList from "@/components/lists/ReceivedRequestsList";
import { getRequests } from "@/api/functions/requests";
import { getInvitations } from "@/api/functions/invitations";
import { InboxIcon } from "lucide-react";

export default function Inbox() {
  const [
    { data: requests, isLoading: isRequestsLoading },
    { data: invitations, isLoading: isInvitationsLoading },
  ] = useQueries({
    queries: [
      { queryKey: ["requests"], queryFn: getRequests },
      { queryKey: ["invitations"], queryFn: getInvitations },
    ],
  });

  return (
    <div>
      <Header
        icon={InboxIcon}
        title="Inbox"
        description="Review invitations and join requests in one place."
      />
      <Tabs defaultValue="requests" className="flex flex-col">
        <TabsList>
          <TabsTrigger value="requests">
            Sent ({requests?.length ?? 0})
          </TabsTrigger>
          <TabsTrigger value="invitations">
            Received ({invitations?.length ?? 0})
          </TabsTrigger>
        </TabsList>
        <TabsContent value="requests">
          <SentRequestsList requests={requests} isLoading={isRequestsLoading} />
        </TabsContent>

        <TabsContent value="invitations">
          <ReceivedRequestsList
            requests={invitations}
            isLoading={isInvitationsLoading}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
