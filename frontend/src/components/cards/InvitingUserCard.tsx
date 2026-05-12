import { useMutation } from "@tanstack/react-query";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { Button } from "../ui/button";
import { getImageUrl } from "@/lib/utils";

export default function InvitingUserCard({ user }) {
  const { mutate, isPending } = useMutation({
    mutationFn: () => {
      console.log("hi");
      return 6;
    },
  });
  return (
    <div className="flex items-center gap-3 rounded-lg p-2 hover:bg-muted">
      <Avatar className="h-8 w-8">
        <AvatarImage src={getImageUrl(user?.avatar)} />
        <AvatarFallback>{user?.full_name?.[0]}</AvatarFallback>
      </Avatar>
      <div className="flex-1 text-sm">
        <div className="font-medium">{user?.full_name}</div>
        <div className="text-xs text-muted-foreground">@{user?.username}</div>
      </div>
      <Button size="sm" variant="outline" onClick={() => mutate()}>
        Invite
      </Button>
    </div>
  );
}
