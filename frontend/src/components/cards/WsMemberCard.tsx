import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { getImageUrl } from "@/lib/utils";

export default function WsMemberCard({ member }) {
  return (
    <div className="flex items-center gap-4 border-b p-4 last:border-b-0">
      <Avatar>
        <AvatarImage src={getImageUrl(member?.user?.avatar)} />
        <AvatarFallback>{member?.user?.full_name?.[0]}</AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <div className="font-medium">{member?.user?.full_name}</div>
        <div className="text-xs text-muted-foreground">
          @{member?.user?.username}
        </div>
      </div>
      <Select defaultValue={member?.role}>
        <SelectTrigger className="w-32">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="owner">Owner</SelectItem>
          <SelectItem value="admin">Admin</SelectItem>
          <SelectItem value="member">Member</SelectItem>
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
}
