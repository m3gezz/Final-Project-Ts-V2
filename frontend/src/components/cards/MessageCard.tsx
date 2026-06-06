import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatTime, getImageUrl, handleCopy } from "@/lib/utils";
import { useParams } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Copy,
  Download,
  File,
  Pen,
  Pin,
  PinOff,
  Reply,
  Star,
  StarOff,
  X,
} from "lucide-react";
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
import { Button } from "../ui/button";

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
    <article
      id={`message-${message?.id}`}
      key={message?.id}
      className="flex items-end gap-4"
    >
      <ContextMenu>
        <div className="w-full flex flex-col items-end gap-1">
          <ContextMenuTrigger
            className={`flex flex-col items-end gap-2 max-w-1/2 px-4 py-3 rounded-lg rounded-br-none ${message?.isDeleted ? "text-destructive bg-destructive/10" : "bg-muted"}`}
          >
            {message?.message && <p>{message?.message}</p>}
            {message?.file && (
              <div className="aspect-video relative rounded-md overflow-clip">
                {message?.type === "image" && (
                  <img
                    src={URL.createObjectURL(message?.file)}
                    className="w-full h-full object-cover"
                  />
                )}

                {message?.type === "video" && (
                  <video
                    controls
                    src={URL.createObjectURL(message?.file)}
                    className="w-full h-full object-cover"
                  />
                )}

                {message?.type === "file" && (
                  <div className="bg-border w-full h-full rounded-lg flex items-center gap-4 py-2 px-4">
                    <File className="w-10 h-10" />
                    <div>
                      <h1>{message?.file?.name}</h1>
                      <h1>{message?.file?.size}Kb</h1>
                    </div>
                    <Button size={"icon"} variant={"ghost"}>
                      <Download className="w-6 h-6" />
                    </Button>
                  </div>
                )}
              </div>
            )}
          </ContextMenuTrigger>

          <span className="text-xs text-muted-foreground flex items-center gap-1">
            {message?.isStared && <Star className="h-2.5 w-2.5" />}
            {formatTime(message?.created_at)}
          </span>
        </div>
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
            <ContextMenuItem variant={"done"}>
              {message?.isPinned ? (
                <>
                  <StarOff /> Unstar
                </>
              ) : (
                <>
                  <Star /> Star
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
      <Avatar className="h-9 w-9">
        <AvatarImage src={getImageUrl(message?.user?.avatar)} />
        <AvatarFallback>
          {user?.full_name?.[0]?.toLocaleUpperCase()}
        </AvatarFallback>
      </Avatar>
    </article>
  ) : (
    <article
      id={`message-${message?.id}`}
      key={message?.id}
      className="flex items-end gap-4"
    >
      <Avatar className="h-9 w-9">
        <AvatarImage src={getImageUrl(message?.user?.avatar)} />
        <AvatarFallback>
          {message?.user?.full_name?.[0]?.toLocaleUpperCase()}
        </AvatarFallback>
      </Avatar>
      <ContextMenu>
        <div className="flex flex-col gap-1 w-full">
          <div className="w-full flex flex-col items-start gap-1">
            <span className="italic text-xs">{message?.user?.full_name}</span>

            <ContextMenuTrigger
              className={`max-w-1/2 px-4 py-3 rounded-lg rounded-bl-none ${message?.isDeleted ? "text-destructive bg-destructive/10" : "bg-accent/50"}`}
            >
              {message?.message}
            </ContextMenuTrigger>

            <span className="text-xs text-muted-foreground flex items-center gap-1">
              {message?.isStared && <Star className="h-2.5 w-2.5" />}
              {formatTime(message?.created_at)}
            </span>
          </div>
        </div>
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
            <ContextMenuItem variant={"done"}>
              {message?.isPinned ? (
                <>
                  <StarOff /> Unstar
                </>
              ) : (
                <>
                  <Star /> Star
                </>
              )}
            </ContextMenuItem>
          </ContextMenuContent>
        )}
      </ContextMenu>
    </article>
  );
}
