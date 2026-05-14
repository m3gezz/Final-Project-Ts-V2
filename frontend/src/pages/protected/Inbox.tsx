import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Header from "@/components/slices/Header";
import { useQueries } from "@tanstack/react-query";
import { getInvitations, getRequests } from "@/api/functions/inbox";
import SentRequestsList from "@/components/lists/SentRequestsList";
import ReceivedRequestsList from "@/components/lists/ReceivedRequestsList";

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
        title="Inbox"
        description="Review invitations and join requests in one place."
      />
      <Tabs defaultValue="requests" className="flex flex-col">
        <TabsList className="p-1">
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
