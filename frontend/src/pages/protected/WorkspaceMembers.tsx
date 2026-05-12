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
import { getImageUrl } from "@/lib/utils";
import InvitingModal from "@/components/modals/InvitingModal";
import WsMemberCard from "@/components/cards/WsMemberCard";
import WsMembersList from "@/components/lists/WsMembersList";

export default function WorkspaceMembers() {
  const { id } = useParams();
  const { data: workspace, isLoading } = useQuery({
    queryKey: ["workspace", id],
    queryFn: () => getWorkspace(id, "members"),
  });

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
          <InvitingModal />
        </Dialog>
      </div>

      <WsMembersList
        members={workspace?.project?.members}
        isLoading={isLoading}
      />

      {/* <div>
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
      </div> */}
    </div>
  );
}
