import { Paperclip, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import InputController from "@/components/controllers/InputController";
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
  const { data: messages, isLoading } = useQuery({
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
    <main className="grid lg:grid-cols-[5fr_2fr] gap-4">
      <section className="flex h-[calc(100vh-8rem)] flex-col rounded-xl border bg-card">
        <div className="border-b p-4">
          <h1 className="text-lg font-semibold">Chat</h1>
          <p className="text-xs text-muted-foreground">
            All messages stay private to this workspace.
          </p>
        </div>

        <MessagesList messages={messages} isLoading={isLoading} />

        <form
          onSubmit={form.handleSubmit((data) => mutate(data))}
          className="flex relative items-center justify-between gap-2 border-t p-2 mt-auto"
        >
          <Button variant="ghost" size="icon" type="button">
            <input type="file" accept="images/*" className="hidden" multiple />
            <Paperclip className="h-4 w-4" />
          </Button>

          <div className="flex-1 pb-4">
            <InputController
              control={form.control}
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
      <section className="p-4">
        <h1 className="text-2xl font-bold mb-4">Pinned messages</h1>
        <ul>
          {messages
            ?.filter((m: PopulatedMessage) => m?.isPinned)
            ?.slice(0, 5)
            ?.map((m: PopulatedMessage, i: number) => (
              <li key={i} className="flex items-start gap-2 border-l pb-4">
                <div className="-ml-1 h-2 w-2 bg-primary rounded-full mt-2" />
                <div>
                  <h2>{m?.user?.full_name}</h2>
                  <p className="italic text-xs truncate border rounded-2xl w-full px-4 py-2 mt-2">
                    {m?.message}
                  </p>
                </div>
              </li>
            ))}
        </ul>
      </section>
    </main>
  );
}
