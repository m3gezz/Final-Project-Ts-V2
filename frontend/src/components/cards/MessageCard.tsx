import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSelector } from "react-redux";
import { formatTime, getImageUrl } from "@/lib/utils";
import { useParams } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "../ui/button";
import { Pen, X } from "lucide-react";
import { deleteMessage } from "@/api/functions/message";

export default function MessageCard({ message }) {
  const { id } = useParams();
  const { user } = useSelector((state) => state?.auth);

  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: () => deleteMessage(message?.id),
    onMutate: () => {
      const previous = queryClient.getQueryData(["messages", String(id)]);
      queryClient.setQueryData(["messages", String(id)], (old) => [
        ...old.filter((m) => m?.id != message?.id),
      ]);
      return { previous };
    },
  });

  return user?.id === message?.user?.id ? (
    <div className="flex justify-end gap-2 items-start text-end">
      <div className="flex flex-col gap-1 w-full">
        <div>
          <Button
            size={"icon-xs"}
            variant={"secondary"}
            onClick={() => console.log("hi")}
            className="mx-2"
          >
            <Pen />
          </Button>
          <span className="font-medium">
            <span className="text-xs text-muted-foreground">
              {formatTime(message?.created_at)}
            </span>{" "}
            You
          </span>
        </div>
        <div className="relative rounded flex justify-end">
          <Button
            size={"icon-xs"}
            variant={"destructive"}
            onClick={() => mutate()}
            className="my-auto mx-2"
          >
            <X />
          </Button>
          <p className="w-[90%] p-2 rounded border rounded-tr-none">
            {message?.message}
          </p>
        </div>
      </div>
      <Avatar className="h-9 w-9">
        <AvatarImage src={getImageUrl(user?.avatar)} />
        <AvatarFallback>{user?.full_name?.[0]}</AvatarFallback>
      </Avatar>
    </div>
  ) : (
    <div key={message?.id} className="flex gap-2 items-start">
      <Avatar className="h-9 w-9">
        <AvatarImage src={getImageUrl(message?.user?.avatar)} />
        <AvatarFallback>{message?.user?.full_name?.[0]}</AvatarFallback>
      </Avatar>
      <div className="flex flex-col gap-1 w-full">
        <span className="font-medium">
          {message?.user?.full_name}{" "}
          <span className="text-xs text-muted-foreground">
            {formatTime(message?.created_at)}
          </span>
        </span>
        <div className="relative rounded flex">
          <p className="w-[90%] p-2 rounded border rounded-tr-none">
            {message?.message}
          </p>
        </div>
      </div>
    </div>
  );
}
