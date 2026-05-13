import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Header from "@/components/slices/Header";
import { Inbox as InboxIcon } from "lucide-react";
import EmptyCard from "@/components/cards/EmptyCard";
import { useQueries } from "@tanstack/react-query";
import { getRequests } from "@/api/functions/inbox";
import SentRequestsList from "@/components/lists/SentRequestsList";

export default function Inbox() {
  const [
    { data: requests, isFetching: isRequestsFetching },
    { data: invitations },
  ] = useQueries({
    queries: [
      { queryKey: ["requests"], queryFn: getRequests },
      { queryKey: ["invitations"], queryFn: getRequests },
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
        <TabsContent value="requests" className="mt-6 space-y-3">
          <SentRequestsList
            requests={requests}
            isLoading={isRequestsFetching}
          />
        </TabsContent>

        <TabsContent value="invitations" className="mt-6 space-y-3">
          {[].length === 0 && (
            <EmptyCard
              icon={InboxIcon}
              title="Nothing here"
              description="You're all caught up."
            />
          )}
          {/* {[].map((i) => {
            return (
              <div
                key={i.id}
                className="flex flex-wrap items-center gap-4 rounded-xl border bg-card p-4"
              >
                <Avatar>
                  <AvatarImage src={from.avatar} />
                  <AvatarFallback>{from.full_name[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="text-sm">
                    <span className="font-medium">{from.full_name}</span>{" "}
                    {i.kind === "invite" ? "invited you to" : "wants to join"}{" "}
                    <span className="font-medium">{ws?.name}</span>
                  </div>
                  <div className="mt-1">
                    <Badge variant="outline">{i.status}</Badge>
                  </div>
                </div>
                {i.status === "pending" && (
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => update(i.id, "declined")}
                    >
                      <X className="mr-1 h-4 w-4" />
                      Decline
                    </Button>
                    <Button size="sm" onClick={() => update(i.id, "accepted")}>
                      <Check className="mr-1 h-4 w-4" />
                      Accept
                    </Button>
                  </div>
                )}
              </div>
            );
          })} */}
        </TabsContent>
      </Tabs>
    </div>
  );
}
