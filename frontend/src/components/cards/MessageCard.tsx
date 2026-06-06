import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatTime, getImageUrl, handleCopy } from "@/lib/utils";
import { useParams } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Copy, Download, File, Pen, Pin, PinOff, Reply, X } from "lucide-react";
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
import { setReply } from "@/redux/replySlice";

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
                  attachment: {},
                  replied_to: null,
                  replied_to_message: null,
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

  const handleDownload = (filePath: string) => {
    const fileName = filePath.split("/").pop();

    window.open(`http://localhost:8000/api/download/${fileName}`, "_blank");
  };

  const handleReply = () => {
    disp(setReply({ reply: message }));
  };

  return user?.id === message?.user?.id ? (
    <article
      id={`message-${message?.id}`}
      key={message?.id}
      className="flex items-end gap-4"
    >
      <ContextMenu>
        <div className="w-full flex flex-col items-end gap-1">
          {!!message?.replied_to_message && (
            <div
              onClick={() =>
                document
                  .getElementById(`message-${message?.replied_to_message?.id}`)
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="flex-1 p-2 h-10 border backdrop-blur-2xl rounded-md flex items-center gap-2"
            >
              {!!message?.replied_to_message?.attachment && (
                <div className="aspect-square h-10 relative rounded-md overflow-hidden">
                  {message?.replied_to_message?.attachment?.file_type ===
                    "image" && (
                    <img
                      src={getImageUrl(
                        message?.replied_to_message?.attachment?.file_path,
                      )}
                      className="w-full h-full object-cover"
                    />
                  )}

                  {message?.replied_to_message?.attachment?.file_type ===
                    "video" && (
                    <video
                      src={getImageUrl(
                        message?.replied_to_message?.attachment?.file_path,
                      )}
                      className="w-full h-full object-cover"
                    />
                  )}
                  {message?.replied_to_message?.attachment?.file_type ===
                    "document" && (
                    <div className="bg-muted w-full h-full rounded-lg flex flex-col items-center gap-4 p-2">
                      <File className="w-4 h-4" />
                      <div>
                        <h1>
                          size:{" "}
                          {message?.replied_to_message?.attachment?.file_size}
                          Kb
                        </h1>
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div>
                <p className="text-xs truncate text-brand-primary">
                  {message?.replied_to_message?.user?.full_name}
                </p>
                <p className="text-xs italic">
                  {message?.replied_to_message?.message}
                </p>
              </div>
            </div>
          )}
          <ContextMenuTrigger
            className={`flex flex-col items-end gap-2 lg:max-w-1/2 p-2 rounded-lg rounded-br-none ${message?.isDeleted ? "text-destructive bg-destructive/10" : "bg-muted"}`}
          >
            {!!message?.message?.length && <p>{message?.message}</p>}
            {!!message?.attachment && (
              <>
                <div className="aspect-video relative rounded-md overflow-clip">
                  {message?.attachment?.file_type === "image" && (
                    <>
                      <img
                        src={getImageUrl(message?.attachment?.file_path)}
                        className="w-full h-full object-cover"
                      />
                      <Button
                        size={"icon"}
                        variant={"ghost"}
                        type="button"
                        className="absolute bottom-2 right-2"
                        onClick={() =>
                          handleDownload(message?.attachment?.file_path)
                        }
                      >
                        <Download className="w-6 h-6" />
                      </Button>
                    </>
                  )}

                  {message?.attachment?.file_type === "video" && (
                    <video
                      controls
                      src={getImageUrl(message?.attachment?.file_path)}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                {message?.attachment?.file_type === "document" && (
                  <div className="bg-border w-full h-full rounded-lg flex items-center gap-4 py-2 px-4">
                    <File className="w-6 h-6" />
                    <div>
                      <h1>size: {message?.attachment?.file_size}Kb</h1>
                    </div>
                    <Button
                      size={"icon"}
                      variant={"ghost"}
                      type="button"
                      onClick={() =>
                        handleDownload(message?.attachment?.file_path)
                      }
                    >
                      <Download className="w-6 h-6" />
                    </Button>
                  </div>
                )}
                {message?.attachment?.file_name && (
                  <p className="italic text-xs truncate mt-1 text-foreground">
                    {message?.attachment?.file_name}
                  </p>
                )}
              </>
            )}
          </ContextMenuTrigger>

          <span className="text-xs text-muted-foreground flex items-center gap-1">
            {formatTime(message?.created_at)}
            {!!message?.isPinned && <Pin className="h-2.5 w-2.5" />}
          </span>
        </div>
        {!message?.isDeleted && (
          <ContextMenuContent>
            <ContextMenuItem onClick={() => handleCopy(message?.message)}>
              <Copy /> Copy
            </ContextMenuItem>
            <ContextMenuItem onClick={handleReply}>
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
            {!!message?.replied_to_message && (
              <div
                onClick={() =>
                  document
                    .getElementById(
                      `message-${message?.replied_to_message?.id}`,
                    )
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                className="flex-1 p-2 h-10 border backdrop-blur-2xl rounded-md flex items-center gap-2"
              >
                {!!message?.replied_to_message?.attachment && (
                  <div className="aspect-square h-10 relative rounded-md overflow-hidden">
                    {message?.replied_to_message?.attachment?.file_type ===
                      "image" && (
                      <img
                        src={getImageUrl(
                          message?.replied_to_message?.attachment?.file_path,
                        )}
                        className="w-full h-full object-cover"
                      />
                    )}

                    {message?.replied_to_message?.attachment?.file_type ===
                      "video" && (
                      <video
                        src={getImageUrl(
                          message?.replied_to_message?.attachment?.file_path,
                        )}
                        className="w-full h-full object-cover"
                      />
                    )}
                    {message?.replied_to_message?.attachment?.file_type ===
                      "document" && (
                      <div className="bg-muted w-full h-full rounded-lg flex flex-col items-center gap-4 p-2">
                        <File className="w-4 h-4" />
                        <div>
                          <h1>
                            size:{" "}
                            {message?.replied_to_message?.attachment?.file_size}
                            Kb
                          </h1>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <div>
                  <p className="text-xs truncate text-brand-primary">
                    {message?.replied_to_message?.user?.full_name}
                  </p>
                  <p className="text-xs italic">
                    {message?.replied_to_message?.message}
                  </p>
                </div>
              </div>
            )}
            <span className="italic text-xs">{message?.user?.full_name}</span>
            <ContextMenuTrigger
              className={`flex flex-col items-start gap-2 lg:max-w-1/2 p-2 rounded-lg rounded-bl-none ${message?.isDeleted ? "text-destructive bg-destructive/10" : "bg-border"}`}
            >
              {!!message?.message?.length && <p>{message?.message}</p>}
              {!!message?.attachment && (
                <>
                  <div className="aspect-video relative rounded-md overflow-clip">
                    {message?.attachment?.file_type === "image" && (
                      <>
                        <img
                          src={getImageUrl(message?.attachment?.file_path)}
                          className="w-full h-full object-cover"
                        />
                        <Button
                          size={"icon"}
                          variant={"ghost"}
                          type="button"
                          className="absolute bottom-2 right-2"
                          onClick={() =>
                            handleDownload(message?.attachment?.file_path)
                          }
                        >
                          <Download className="w-6 h-6" />
                        </Button>
                      </>
                    )}

                    {message?.attachment?.file_type === "video" && (
                      <video
                        controls
                        src={getImageUrl(message?.attachment?.file_path)}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  {message?.attachment?.file_type === "document" && (
                    <div className="bg-muted w-full h-full rounded-lg flex items-center gap-4 py-2 px-4">
                      <File className="w-6 h-6" />
                      <div>
                        <h1>size: {message?.attachment?.file_size}Kb</h1>
                      </div>
                      <Button
                        size={"icon"}
                        variant={"ghost"}
                        type="button"
                        onClick={() =>
                          handleDownload(message?.attachment?.file_path)
                        }
                      >
                        <Download className="w-6 h-6" />
                      </Button>
                    </div>
                  )}
                  {message?.attachment?.file_name && (
                    <p className="italic text-xs truncate mt-1 text-foreground">
                      {message?.attachment?.file_name}
                    </p>
                  )}
                </>
              )}
            </ContextMenuTrigger>

            <span className="text-xs text-muted-foreground flex items-center gap-1">
              {!!message?.isPinned && <Pin className="h-2.5 w-2.5" />}
              {formatTime(message?.created_at)}
            </span>
          </div>
        </div>
        {!message?.isDeleted && (
          <ContextMenuContent>
            <ContextMenuItem onClick={() => handleCopy(message?.message)}>
              <Copy /> Copy
            </ContextMenuItem>
            <ContextMenuItem onClick={handleReply}>
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
          </ContextMenuContent>
        )}
      </ContextMenu>
    </article>
  );
}
