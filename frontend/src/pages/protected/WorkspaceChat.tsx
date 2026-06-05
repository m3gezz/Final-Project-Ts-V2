import { MessagesSquare, Paperclip, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createMessage, getMessages } from "@/api/functions/messages";
import echo from "@/reverb/echo";
import { useEffect } from "react";
import MessagesList from "@/components/lists/MessagesList";
import type { PopulatedMessage } from "@/assets/types";
import { useAppSelector } from "@/redux/store";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createMessageSchema,
  type createMessageSchemaType,
} from "@/zod/messagesSchemas";
import UpdateMessageModal from "@/components/modals/UpdateMessageModal";
import PinnedList from "@/components/lists/PinnedList";
import AssetsList from "@/components/lists/AssetsList";
import TextareaController from "@/components/controllers/TextareaController";

export default function WorkspaceChat() {
  const { id } = useParams();
  const { user } = useAppSelector((state) => state?.auth);
  const form = useForm({
    defaultValues: {
      workspace_id: String(id),
      message: "",
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
      const previous = queryClient.getQueryData(["messages", String(id)]);
      queryClient.setQueryData(
        ["messages", String(id)],
        (old: PopulatedMessage[]) => [
          ...old,
          { ...data, id: Date.now, user, created_at: Date() },
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

  return (
    <main className="grid lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] gap-4">
      <section className="flex h-[calc(100vh-4rem)] flex-col rounded-xl border bg-card">
        <div className="border-b p-4">
          <h1 className="text-lg font-semibold flex items-center gap-2 mb-2">
            <MessagesSquare className="h-6 w-6 text-accent" /> Team discussion
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
          <Button variant="ghost" size="icon" type="button">
            <input type="file" accept="images/*" className="hidden" multiple />
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
      </section>
      <section className="grid lg:grid-rows-2 gap-2">
        <PinnedList
          messages={messages
            ?.filter((m: PopulatedMessage) => m?.isPinned)
            ?.slice(0, 3)}
          isLoading={isMessagesLoading}
        />
        <AssetsList
          messages={messages
            ?.filter((m: PopulatedMessage) => m?.isPinned)
            ?.slice(0, 3)}
          isLoading={isMessagesLoading}
        />
      </section>
    </main>
  );
}
