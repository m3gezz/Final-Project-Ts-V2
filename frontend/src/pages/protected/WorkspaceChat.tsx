import { FileText, Paperclip, Plus, Send, X } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import InputController from "@/components/controllers/InputController";
import { messages } from "@/data/exp";
import { useRef, useState } from "react";

export default function WorkspaceChat() {
  const attachmentRef = useRef("");
  const [IsAttached, setIsAttached] = useState<boolean>(false);
  const [attachments, setAttachments] = useState<any[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const { id } = useParams();
  const form = useForm({
    defaultValues: {
      workspace_id: id,
      text: "",
      attachments: [{ type: "image", file: "" }],
    },
  });

  const handleFiles = (e) => {
    const files = e?.target?.files;
    if (!files) return;
    setIsAttached(true);
    Array.from(files)
      .splice(0, 5)
      .map((f) => {
        setPreviews((prev) => [...prev, URL.createObjectURL(f)]);
        setAttachments((prev) => [...prev, f]);
      });
  };

  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <div className="flex h-[calc(100vh-8rem)] flex-col rounded-xl border bg-card">
      <div className="border-b p-4">
        <h1 className="text-lg font-semibold">Chat</h1>
        <p className="text-xs text-muted-foreground">
          All messages stay private to this workspace.
        </p>
      </div>
      <div className="flex-1 space-y-4 overflow-auto p-4">
        {messages.map((m) => {
          const u = {};
          return (
            <div key={m.id} className="flex gap-3">
              <Avatar className="h-9 w-9">
                <AvatarImage src={u?.avatar} />
                <AvatarFallback>{u?.full_name?.[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-baseline gap-2">
                  <span className="font-medium">{u?.full_name}</span>
                  <span className="text-xs text-muted-foreground">{m.at}</span>
                </div>
                <div className="mt-0.5 text-sm">{m.text}</div>
                {m.attachment && (
                  <div className="mt-2 inline-flex items-center gap-2 rounded-lg border bg-muted/40 px-3 py-2 text-sm">
                    <FileText className="h-4 w-4 text-primary" />{" "}
                    {m.attachment.name}{" "}
                    <span className="text-xs text-muted-foreground">
                      {m.attachment.size}
                    </span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex relative items-center justify-between gap-2 border-t p-2"
      >
        <Button variant="ghost" size="icon" type="button">
          <input
            type="file"
            accept="images/*"
            className="hidden"
            multiple
            onChange={handleFiles}
          />
          <Paperclip className="h-4 w-4" />
        </Button>

        <div
          className={`absolute left-0 bottom-full rounded-t-lg border-t transition-all ${IsAttached ? "h-50 opacity-100" : "opacity-0 h-0 overflow-hidden"} bg-card w-full flex items-end justify-center`}
        >
          <div className="relative w-[90%] flex items-center gap-2 overflow-x-scroll">
            {previews?.map((p, i) => (
              <div
                key={i}
                className={`relative h-40 min-w-40 max-w-40 rounded-xl overflow-hidden`}
              >
                <Button
                  size={"icon"}
                  variant={"ghost"}
                  className="absolute top-1 right-1"
                >
                  <X />
                </Button>
                <img src={p} className="w-full h-full object-cover" />
              </div>
            ))}
            {previews.length < 5 && (
              <Button className="h-40 min-w-40 rounded-xl">
                <Plus />
              </Button>
            )}
          </div>
          <Button
            size={"icon"}
            variant={"ghost"}
            className="absolute top-1 right-1"
            onClick={() => {
              setAttachments([]);
              setIsAttached(false);
              attachmentRef.current.value = null;
            }}
          >
            <X />
          </Button>
        </div>

        <div className="flex-1 pb-4">
          <InputController
            control={form.control}
            f={{
              name: "text",
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
