import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import SectionHeader from "@/components/common/SectionHeader";
import { invitations, findUser, findWorkspace } from "@/app/mock-data";
import { Inbox as InboxIcon, Check, X } from "lucide-react";
import EmptyState from "@/components/common/EmptyState";
import { toast } from "sonner";

export default function Inbox() {
  const me = "u1";
  const [items, setItems] = useState(invitations);

  const received = items.filter(
    (i) =>
      i.toUserId === me && (i.kind === "invite" || i.kind === "join_request"),
  );
  const sent = items.filter((i) => i.fromUserId === me);

  const update = (
    id: string,
    status: "accepted" | "declined" | "cancelled",
  ) => {
    setItems((prev) =>
      prev.map((i) =>
        i.id === id
          ? { ...i, status: status === "cancelled" ? "declined" : status }
          : i,
      ),
    );
    toast.success(
      status === "accepted"
        ? "Accepted"
        : status === "declined"
          ? "Declined"
          : "Cancelled",
    );
  };

  return (
    <div>
      <SectionHeader
        title="Inbox"
        description="Review invitations and join requests in one place."
      />
      <Tabs defaultValue="received">
        <TabsList>
          <TabsTrigger value="received">
            Received ({received.length})
          </TabsTrigger>
          <TabsTrigger value="sent">Sent ({sent.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="received" className="mt-6 space-y-3">
          {received.length === 0 && (
            <EmptyState
              icon={InboxIcon}
              title="Nothing here"
              description="You're all caught up."
            />
          )}
          {received.map((i) => {
            const from = findUser(i.fromUserId);
            const ws = findWorkspace(i.workspaceId);
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
          })}
        </TabsContent>

        <TabsContent value="sent" className="mt-6 space-y-3">
          {sent.length === 0 && (
            <EmptyState icon={InboxIcon} title="No sent requests" />
          )}
          {sent.map((i) => {
            const to = findUser(i.toUserId);
            const ws = findWorkspace(i.workspaceId);
            return (
              <div
                key={i.id}
                className="flex flex-wrap items-center gap-4 rounded-xl border bg-card p-4"
              >
                <Avatar>
                  <AvatarImage src={to.avatar} />
                  <AvatarFallback>{to.full_name[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="text-sm">
                    Invitation to{" "}
                    <span className="font-medium">{to.full_name}</span> for{" "}
                    <span className="font-medium">{ws?.name}</span>
                  </div>
                  <div className="mt-1">
                    <Badge variant="outline">{i.status}</Badge>
                  </div>
                </div>
                {i.status === "pending" && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => update(i.id, "cancelled")}
                  >
                    Cancel
                  </Button>
                )}
              </div>
            );
          })}
        </TabsContent>
      </Tabs>
    </div>
  );
}
