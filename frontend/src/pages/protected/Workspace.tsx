import { useState } from "react";
import { useParams, Navigate, NavLink, Routes, Route } from "react-router-dom";
import {
  findWorkspace,
  findUser,
  findProject,
  tasks as allTasks,
  messages as allMsgs,
  invitations as allInv,
  users,
  type Task,
} from "@/data/exp";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import {
  LayoutDashboard,
  Users as UsersIcon,
  MessageSquare,
  KanbanSquare,
  Paperclip,
  Settings,
  Send,
  Plus,
  UserPlus,
  X,
  FileText,
  Image as ImageIcon,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { getWorkspace } from "@/api/functions/workspace";
import { Link } from "react-router-dom";

export default function Workspace() {
  const { id } = useParams();
  const { data: workspace } = useQuery({
    queryKey: ["workspace", id],
    queryFn: () => getWorkspace(id, "overview"),
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          {workspace?.project?.title}'s Workspace
        </h1>
        <p className="text-sm text-muted-foreground">
          Project overview & activity
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border bg-card p-5">
          <div className="text-sm text-muted-foreground">Progress</div>
          <div className="mt-1 text-3xl font-semibold">{100}%</div>
          <Progress value={100} className="mt-3" />
        </div>
        <Link
          to={"tasks"}
          className="rounded-xl border bg-card p-4 hover:border-primary/50"
        >
          <div className="text-sm text-muted-foreground">Open tasks</div>
          <div className="mt-1 text-3xl font-semibold">
            {workspace?.tasks_count ?? 0}
          </div>
        </Link>
        <Link
          to={"members"}
          className="rounded-xl border bg-card p-4 hover:border-primary/50"
        >
          <div className="text-sm text-muted-foreground">Members</div>
          <div className="mt-1 text-3xl font-semibold">
            {workspace?.members_count ?? 0}
          </div>
        </Link>
      </div>
      <div className="rounded-xl border bg-card p-6">
        <h2 className="text-lg font-semibold">Recent activity</h2>
        <ul className="mt-4 space-y-3 text-sm">
          {[
            "Alex updated the onboarding mocks",
            "Sam closed task: Set up auth + RLS",
            "Nora joined the workspace",
            "Diego commented on Pricing experiments",
          ].map((s, i) => (
            <li key={i} className="flex items-center gap-3">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              {s}{" "}
              <span className="ml-auto text-xs text-muted-foreground">
                {i + 1}h ago
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function Members({ workspaceId }: { workspaceId: string }) {
  const ws = findWorkspace(workspaceId)!;
  const reqs = allInv.filter((i) => i.workspaceId === workspaceId);
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Members</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="mr-2 h-4 w-4" />
              Invite
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Invite to workspace</DialogTitle>
            </DialogHeader>
            <div className="space-y-3">
              <Input placeholder="Search users by name or email…" />
              <div className="max-h-60 space-y-2 overflow-auto">
                {users.map((u) => (
                  <div
                    key={u.id}
                    className="flex items-center gap-3 rounded-lg p-2 hover:bg-muted"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={u.avatar} />
                      <AvatarFallback>{u.full_name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 text-sm">
                      <div className="font-medium">{u.full_name}</div>
                      <div className="text-xs text-muted-foreground">
                        @{u.username}
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => toast.success("Invitation sent")}
                    >
                      Invite
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-xl border bg-card">
        {ws.members.map((m) => {
          const u = findUser(m.userId);
          return (
            <div
              key={m.userId}
              className="flex items-center gap-4 border-b p-4 last:border-b-0"
            >
              <Avatar>
                <AvatarImage src={u.avatar} />
                <AvatarFallback>{u.full_name[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="font-medium">{u.full_name}</div>
                <div className="text-xs text-muted-foreground">
                  @{u.username}
                </div>
              </div>
              <Select defaultValue={m.role}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Owner">Owner</SelectItem>
                  <SelectItem value="Admin">Admin</SelectItem>
                  <SelectItem value="Member">Member</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => toast.success("Member removed")}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          );
        })}
      </div>

      <div>
        <h2 className="mb-3 text-lg font-semibold">Requests & invitations</h2>
        <div className="space-y-2">
          {reqs.map((r) => {
            const from = findUser(r.fromUserId);
            const to = findUser(r.toUserId);
            return (
              <div
                key={r.id}
                className="flex items-center gap-3 rounded-lg border bg-card p-3"
              >
                <Badge variant="outline">{r.kind.replace("_", " ")}</Badge>
                <div className="flex-1 text-sm">
                  {r.kind === "invite" ? (
                    <>
                      Invitation sent to <b>{to.full_name}</b>
                    </>
                  ) : (
                    <>
                      <b>{from.full_name}</b> wants to join
                    </>
                  )}
                </div>
                <Badge variant="secondary">{r.status}</Badge>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function Chat({ workspaceId }: { workspaceId: string }) {
  const [msgs, setMsgs] = useState(
    allMsgs.filter((m) => m.workspaceId === workspaceId),
  );
  const [text, setText] = useState("");

  const send = () => {
    if (!text.trim()) return;
    setMsgs([
      ...msgs,
      { id: `m${Date.now()}`, workspaceId, userId: "u1", text, at: "now" },
    ]);
    setText("");
  };

  return (
    <div className="flex h-[calc(100vh-8rem)] flex-col rounded-xl border bg-card">
      <div className="border-b p-4">
        <h1 className="text-lg font-semibold">Chat</h1>
        <p className="text-xs text-muted-foreground">
          All messages stay private to this workspace.
        </p>
      </div>
      <div className="flex-1 space-y-4 overflow-auto p-4">
        {msgs.map((m) => {
          const u = findUser(m.userId);
          return (
            <div key={m.id} className="flex gap-3">
              <Avatar className="h-9 w-9">
                <AvatarImage src={u.avatar} />
                <AvatarFallback>{u.full_name[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-baseline gap-2">
                  <span className="font-medium">{u.full_name}</span>
                  <span className="text-xs text-muted-foreground">{m.at}</span>
                </div>
                <div className="mt-0.5 text-sm">{m.text}</div>
                {m.attachment && (
                  <div className="mt-2 inline-flex items-center gap-2 rounded-lg border bg-muted/40 px-3 py-2 text-sm">
                    <FileText className="h-4 w-4 text-primary" />{" "}
                    {m.attachment.name}{" "}
                    <span className="text-xs text-muted-foreground">
                      {m.attachment.size}
                    </span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
      <div className="flex items-center gap-2 border-t p-3">
        <Button variant="ghost" size="icon">
          <Paperclip className="h-4 w-4" />
        </Button>
        <Input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder="Message the team…"
        />
        <Button onClick={send}>
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

function TasksBoard({ workspaceId }: { workspaceId: string }) {
  const [tasks, setTasks] = useState<Task[]>(
    allTasks.filter((t) => t.workspaceId === workspaceId),
  );
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [assignee, setAssignee] = useState<string | undefined>();
  const cols: { key: Task["status"]; label: string }[] = [
    { key: "todo", label: "To do" },
    { key: "doing", label: "In progress" },
    { key: "done", label: "Done" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Tasks</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New task
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create task</DialogTitle>
            </DialogHeader>
            <div className="space-y-3">
              <Input
                placeholder="Task title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <Textarea placeholder="Description (optional)" rows={3} />
              <Select value={assignee} onValueChange={setAssignee}>
                <SelectTrigger>
                  <SelectValue placeholder="Assign to…" />
                </SelectTrigger>
                <SelectContent>
                  {users.map((u) => (
                    <SelectItem key={u.id} value={u.id}>
                      {u.full_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <DialogFooter>
              <Button
                onClick={() => {
                  if (!title.trim()) return;
                  setTasks([
                    ...tasks,
                    {
                      id: `t${Date.now()}`,
                      workspaceId,
                      title,
                      status: "todo",
                      assigneeId: assignee,
                      priority: "med",
                    },
                  ]);
                  setTitle("");
                  setAssignee(undefined);
                  setOpen(false);
                  toast.success("Task created");
                }}
              >
                Create
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {cols.map((c) => (
          <div
            key={c.key}
            className="flex flex-col gap-3 rounded-xl border bg-muted/30 p-3"
          >
            <div className="flex items-center justify-between px-1 text-sm font-medium">
              <span>{c.label}</span>
              <Badge variant="secondary">
                {tasks.filter((t) => t.status === c.key).length}
              </Badge>
            </div>
            <div className="space-y-2">
              {tasks
                .filter((t) => t.status === c.key)
                .map((t) => {
                  const u = t.assigneeId ? findUser(t.assigneeId) : null;
                  return (
                    <div
                      key={t.id}
                      className="rounded-lg border bg-card p-3"
                      style={{ boxShadow: "var(--shadow-soft)" }}
                    >
                      <div className="text-sm font-medium">{t.title}</div>
                      <div className="mt-2 flex items-center justify-between">
                        <Badge
                          variant={
                            t.priority === "high"
                              ? "destructive"
                              : t.priority === "med"
                                ? "default"
                                : "secondary"
                          }
                          className="text-xs"
                        >
                          {t.priority}
                        </Badge>
                        {u && (
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={u.avatar} />
                            <AvatarFallback>{u.full_name[0]}</AvatarFallback>
                          </Avatar>
                        )}
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Attachments() {
  const files = [
    { name: "v1-scope.pdf", size: "284 KB", icon: FileText },
    { name: "moodboard.png", size: "1.2 MB", icon: ImageIcon },
    { name: "user-research.pdf", size: "612 KB", icon: FileText },
    { name: "logo.svg", size: "12 KB", icon: ImageIcon },
  ];
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Attachments</h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Upload
        </Button>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {files.map((f) => (
          <div
            key={f.name}
            className="flex items-center gap-3 rounded-xl border bg-card p-4"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent text-accent-foreground">
              <f.icon className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <div className="truncate text-sm font-medium">{f.name}</div>
              <div className="text-xs text-muted-foreground">{f.size}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function WSettings({ name }: { name: string }) {
  const [n, setN] = useState(name);
  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
      <div className="rounded-xl border bg-card p-6 space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Workspace name</label>
          <Input value={n} onChange={(e) => setN(e.target.value)} />
        </div>
        <div className="flex justify-end">
          <Button onClick={() => toast.success("Saved")}>Save</Button>
        </div>
      </div>
      <div className="rounded-xl border border-destructive/30 bg-card p-6">
        <h2 className="text-lg font-semibold text-destructive">Danger zone</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Deleting a workspace removes all chat, tasks and attachments.
        </p>
        <Button variant="destructive" className="mt-4">
          Delete workspace
        </Button>
      </div>
    </div>
  );
}
