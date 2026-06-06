import { File, MessagesSquare, Paperclip, Send, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createMessage, getMessages } from "@/api/functions/messages";
import echo from "@/reverb/echo";
import { useEffect } from "react";
import MessagesList from "@/components/lists/MessagesList";
import type { PopulatedMessage } from "@/assets/types";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createMessageSchema,
  type createMessageSchemaType,
} from "@/zod/messagesSchemas";
import UpdateMessageModal from "@/components/modals/UpdateMessageModal";
import PinnedList from "@/components/lists/PinnedList";
import TextareaController from "@/components/controllers/TextareaController";
import { toggleModal } from "@/redux/modalSlice";
import CreateAttachmentModal from "@/components/modals/CreateAttachmentModal";
import { getImageUrl } from "@/lib/utils";
import { setReply } from "@/redux/replySlice";

export default function WorkspaceChat() {
  const { id } = useParams();
  const disp = useAppDispatch();
  const { user } = useAppSelector((state) => state?.auth);
  const { reply } = useAppSelector((state) => state?.reply);
  const form = useForm({
    defaultValues: {
      workspace_id: String(id),
      message: "",
      replied_to: undefined,
    },
    resolver: zodResolver(createMessageSchema),
  });

  const queryClient = useQueryClient();
  const { data: messages, isLoading: isMessagesLoading } = useQuery({
    queryKey: ["messages", id],
    queryFn: () => getMessages(id),
  });
  const { mutate } = useMutation({
    mutationFn: (data: createMessageSchemaType) => createMessage(data),
    onMutate: (data) => {
      queryClient.cancelQueries();
      form.reset();
      disp(setReply({ reply: null }));
      const previous = queryClient.getQueryData(["messages", String(id)]);
      queryClient.setQueryData(
        ["messages", String(id)],
        (old: PopulatedMessage[]) => [
          ...old,
          {
            ...data,
            id: Date.now,
            user,
            created_at: Date(),
            replied_to_message: reply ?? null,
          },
        ],
      );
      return { previous };
    },
  });

  useEffect(() => {
    echo.private(`workspace.${id}`).listen(".MessageAction", () => {
      queryClient.invalidateQueries({ queryKey: ["messages", String(id)] });
    });

    return () => {
      echo.private(`workspace.${id}`).stopListening(".MessageAction");
    };
  }, [id, queryClient]);

  useEffect(() => {
    if (!reply) return;
    form.setValue("replied_to", Number(reply?.id));
  }, [reply]);

  return (
    <main className="grid lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] gap-4">
      <section className="flex h-[calc(100vh-4rem)] flex-col rounded-xl border bg-card">
        <div className="border-b p-4">
          <h1 className="text-lg font-semibold flex items-center gap-2 mb-2">
            <MessagesSquare className="h-6 w-6" /> Team discussion
          </h1>
          <p className="text-xs text-muted-foreground">
            All messages stay private to this workspace.
          </p>
        </div>

        <MessagesList messages={messages} isLoading={isMessagesLoading} />

        <form
          onSubmit={form.handleSubmit((data) => mutate(data))}
          className="flex relative items-end justify-between gap-2 border-t p-2 mt-auto"
        >
          {!!reply && (
            <article
              className={`absolute flex items-center justify-center gap-4 pb-4 left-1/2 -translate-x-1/2 bottom-full rounded-t-lg py-2 px-20 border backdrop-blur-2xl`}
            >
              <Button
                size={"icon"}
                variant={"destructive"}
                className="absolute right-2 top-2"
                onClick={() => {
                  disp(setReply({ reply: null }));
                  form.resetField("replied_to");
                }}
              >
                <X />
              </Button>

              <div className="">
                <h2>
                  {reply?.user?.full_name}{" "}
                  {!!reply?.message?.length && (
                    <span className="italic text-sm">{reply?.message}</span>
                  )}
                </h2>

                {!!reply?.attachment && (
                  <>
                    <div className="aspect-square h-20 relative rounded-md overflow-hidden">
                      {reply?.attachment?.file_type === "image" && (
                        <img
                          src={getImageUrl(reply?.attachment?.file_path)}
                          className="w-full h-full object-cover"
                        />
                      )}

                      {reply?.attachment?.file_type === "video" && (
                        <video
                          src={getImageUrl(reply?.attachment?.file_path)}
                          className="w-full h-full object-cover"
                        />
                      )}
                      {reply?.attachment?.file_type === "document" && (
                        <div className="bg-muted w-full h-full rounded-lg flex flex-col items-center gap-4 p-2">
                          <File className="w-6 h-6" />
                          <div>
                            <h1>size: {reply?.attachment?.file_size}Kb</h1>
                          </div>
                        </div>
                      )}
                    </div>
                  </>
                )}
                {reply?.attachment?.file_name && (
                  <p className="italic text-xs truncate mt-1 text-foreground">
                    {reply?.attachment?.file_name}
                  </p>
                )}
              </div>
            </article>
          )}
          <Button
            variant="ghost"
            size="icon"
            type="button"
            onClick={() => disp(toggleModal({ name: "isAttachmentMessage" }))}
          >
            <Paperclip className="h-4 w-4" />
          </Button>

          <div className="flex-1">
            <TextareaController
              control={form.control}
              className="min-h-10"
              f={{
                name: "message",
                placeholder: "Message the team…",
              }}
            />
          </div>

          <Button type="submit">
            <Send className="h-4 w-4" />
          </Button>
        </form>
        <UpdateMessageModal />
        <CreateAttachmentModal />
      </section>

      <PinnedList
        messages={messages
          ?.filter((m: PopulatedMessage) => m?.isPinned && !m?.isDeleted)
          ?.reverse()
          ?.slice(0, 3)}
        isLoading={isMessagesLoading}
      />
    </main>
  );
}
