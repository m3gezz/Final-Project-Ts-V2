import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatTime, getImageUrl, handleCopy } from "@/lib/utils";
import { useParams } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Copy, Pen, Pin, PinOff, Reply, X } from "lucide-react";
import { destroyMessage, updateMessage } from "@/api/functions/messages";
import type { PopulatedMessage } from "@/assets/types";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { setValue, toggleModal } from "@/redux/modalSlice";

export default function MessageCard({
  message,
}: {
  message: PopulatedMessage;
}) {
  const { id } = useParams();
  const disp = useAppDispatch();
  const { user } = useAppSelector((state) => state?.auth);
  const queryClient = useQueryClient();

  const { mutate: destroyMessageMutation, isPending: isDestroyMessagePending } =
    useMutation({
      mutationFn: () => destroyMessage(message?.id),
      onMutate: () => {
        queryClient.cancelQueries();
        const previous = queryClient.getQueryData(["messages", String(id)]);
        queryClient.setQueryData(
          ["messages", String(id)],
          (old: PopulatedMessage[]) => [
            ...old?.map((m) => {
              if (m?.id == message?.id) {
                return {
                  ...m,
                  isDeleted: true,
                  message: "This message has been deleted.",
                };
              }
              return m;
            }),
          ],
        );
        return { previous };
      },
    });

  const { mutate: toggleMessagePinMutation } = useMutation({
    mutationFn: () =>
      updateMessage(message?.id, { isPinned: !message?.isPinned }),
    onMutate: () => {
      queryClient.cancelQueries();
      const previous = queryClient.getQueryData(["messages", String(id)]);
      queryClient.setQueryData(
        ["messages", String(id)],
        (old: PopulatedMessage[]) => [
          ...old?.map((m) => {
            if (m?.id == message?.id) {
              return {
                ...m,
                isPinned: !message?.isPinned,
              };
            }
            return m;
          }),
        ],
      );
      return { previous };
    },
  });

  return user?.id === message?.user?.id ? (
    <div className="flex justify-end gap-2 items-start text-end">
      <div className="flex flex-col gap-1 w-full">
        <div>
          <span className="font-medium">
            <span className="text-xs text-muted-foreground">
              {message?.isEdited && "edited"}
            </span>{" "}
            <span className="text-xs text-muted-foreground">
              {formatTime(message?.created_at)}
            </span>{" "}
            You
          </span>
        </div>
        <div className="relative rounded flex justify-end">
          <ContextMenu>
            <ContextMenuTrigger
              className={`max-w-200 py-1 px-4 rounded-lg rounded-tr-none ${message?.isDeleted ? "text-destructive bg-destructive/10" : "bg-muted"}`}
            >
              <p>{message?.message}</p>
            </ContextMenuTrigger>
            {!message?.isDeleted && (
              <ContextMenuContent>
                <ContextMenuItem onClick={() => handleCopy(message?.message)}>
                  <Copy /> Copy
                </ContextMenuItem>
                <ContextMenuItem>
                  <Reply /> Reply
                </ContextMenuItem>
                <ContextMenuItem
                  variant={"todo"}
                  onClick={() => toggleMessagePinMutation()}
                >
                  {message?.isPinned ? (
                    <>
                      <PinOff /> Unpin
                    </>
                  ) : (
                    <>
                      <Pin /> Pin
                    </>
                  )}
                </ContextMenuItem>
                <ContextMenuItem
                  variant={"doing"}
                  onClick={() => {
                    disp(toggleModal({ name: "isUpdateMessage" }));
                    disp(setValue({ value: message }));
                  }}
                >
                  <Pen /> Edit
                </ContextMenuItem>
                <ContextMenuItem
                  disabled={isDestroyMessagePending}
                  onClick={() => destroyMessageMutation()}
                  variant={"destructive"}
                >
                  <X /> Delete
                </ContextMenuItem>
              </ContextMenuContent>
            )}
          </ContextMenu>
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
          </span>{" "}
          <span className="text-xs text-muted-foreground">
            {message?.updated_at != message?.created_at &&
              !message?.isDeleted &&
              "edited"}
          </span>{" "}
        </span>
        <div className="relative rounded flex">
          <p
            className={`max-w-200 py-1 px-4 rounded-lg rounded-tr-none ${message?.isDeleted ? "text-destructive bg-destructive/10" : "bg-muted"}`}
          >
            {message?.message}
          </p>
        </div>
      </div>
    </div>
  );
}
