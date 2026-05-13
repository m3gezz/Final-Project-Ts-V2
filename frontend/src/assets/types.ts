export type Task = {
  id: string;
  workspaceId: string;
  title: string;
  description?: string;
  status: "todo" | "doing" | "done";
  assigneeId?: string;
  priority: "low" | "med" | "high";
};

export type Message = {
  id: string;
  workspaceId: string;
  userId: string;
  text: string;
  at: string;
  attachment?: { name: string; size: string };
};

export type Invitation = {
  id: string;
  workspaceId: string;
  fromUserId: string;
  toUserId: string;
  status: "pending" | "accepted" | "declined";
  kind: "invite" | "join_request" | "leave_request";
};
