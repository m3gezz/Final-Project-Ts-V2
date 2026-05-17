import { Paperclip, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import InputController from "@/components/controllers/InputController";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createMessage, getMessages } from "@/api/functions/message";
import { useSelector } from "react-redux";
import echo from "@/reverb/echo";
import { useEffect } from "react";
import MessagesList from "@/components/lists/MessagesList";

export default function WorkspaceChat() {
  const { id } = useParams();
  const { user } = useSelector((state) => state?.auth);
  const form = useForm({
    defaultValues: {
      workspace_id: id,
      message: "",
    },
  });

  const queryClient = useQueryClient();
  const { data: messages, isLoading } = useQuery({
    queryKey: ["messages", id],
    queryFn: () => getMessages(id),
  });
  const { mutate } = useMutation({
    mutationFn: (data) => createMessage(data),
    onMutate: (data) => {
      form.reset();
      const previous = queryClient.getQueryData(["messages", String(id)]);
      queryClient.setQueryData(["messages", String(id)], (old) => [
        ...old,
        { ...data, id: Date.now, user, created_at: Date() },
      ]);
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
    <div className="flex h-[calc(100vh-8rem)] flex-col rounded-xl border bg-card">
      <div className="border-b p-4">
        <h1 className="text-lg font-semibold">Chat</h1>
        <p className="text-xs text-muted-foreground">
          All messages stay private to this workspace.
        </p>
      </div>

      <MessagesList messages={messages} isLoading={isLoading} />

      <form
        onSubmit={form.handleSubmit(mutate)}
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
    </div>
  );
}
