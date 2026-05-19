import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatTime, getImageUrl } from "@/lib/utils";
import { useParams } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "../ui/button";
import { Check, Pen, X } from "lucide-react";
import { useState } from "react";
import { Input } from "../ui/input";
import { destroyMessage, updateMessage } from "@/api/functions/messages";
import type { PopulatedMessage } from "@/assets/types";
import { useAppSelector } from "@/redux/store";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";

export default function MessageCard({
  message,
}: {
  message: PopulatedMessage;
}) {
  const { id } = useParams();
  const { user } = useAppSelector((state) => state?.auth);
  const [edit, setEdit] = useState({
    editing: false,
    message: message?.message,
  });
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

  const { mutate: updateMessageMutation, isPending: isUpdateMessagePending } =
    useMutation({
      mutationFn: () => updateMessage(message?.id, { message: edit?.message }),
      onMutate: () => {
        queryClient.cancelQueries();
        setEdit((prev) => ({ ...prev, editing: false }));
        const previous = queryClient.getQueryData(["messages", String(id)]);
        queryClient.setQueryData(
          ["messages", String(id)],
          (old: PopulatedMessage[]) => [
            ...old?.map((m) => {
              if (m?.id == message?.id) {
                return { ...m, message: edit?.message };
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
          {edit?.editing && (
            <>
              <Button
                size={"icon-xs"}
                variant={"secondary"}
                onClick={() => setEdit((prev) => ({ ...prev, editing: false }))}
                className="mx-2"
              >
                <X />
              </Button>
              <Button
                size={"icon-xs"}
                variant={"secondary"}
                disabled={isUpdateMessagePending}
                onClick={() => updateMessageMutation()}
                className="my-auto mx-2"
              >
                <Check />
              </Button>
            </>
          )}
          <span className="font-medium">
            <span className="text-xs text-muted-foreground">
              {formatTime(message?.updated_at ?? message?.created_at)}
            </span>{" "}
            You
          </span>
        </div>
        <div className="relative rounded flex justify-end">
          {edit?.editing && !message?.isDeleted ? (
            <Input
              value={edit?.message}
              onChange={(e) =>
                setEdit((prev) => ({ ...prev, message: e?.target?.value }))
              }
              className="w-[80%] max-w-200 p-2 rounded border rounded-tr-none"
            />
          ) : (
            <ContextMenu>
              <ContextMenuTrigger
                className={`max-w-200 py-1 px-4 rounded-lg rounded-tr-none ${message?.isDeleted ? "text-destructive bg-destructive/10" : "bg-muted"}`}
              >
                <p>{message?.message}</p>
              </ContextMenuTrigger>
              {!message?.isDeleted && (
                <ContextMenuContent>
                  <ContextMenuItem
                    onClick={() =>
                      setEdit((prev) => ({ ...prev, editing: true }))
                    }
                    variant={"default"}
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
          )}
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
