import { useEffect, useRef } from "react";
import MessageCard from "../cards/MessageCard";
import MessageCardSkeleton from "../skeletons/MessageCardSkeleton";

export default function MessagesList({
  messages,
  isLoading,
}: {
  messages: any[];
  isLoading: boolean;
}) {
  const bottomRef = useRef(null);
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return isLoading ? (
    <div className="flex-1 h-full space-y-4 overflow-auto p-4">
      {[...Array(2)].map((_, i) => (
        <MessageCardSkeleton key={i} />
      ))}
    </div>
  ) : messages?.length ? (
    <div className="flex-1 h-full space-y-4 overflow-auto p-4">
      {messages?.map((m) => (
        <MessageCard key={m?.id} message={m} />
      ))}
      <div ref={bottomRef} />
    </div>
  ) : (
    <p className="text-sm text-muted-foreground text-center">
      No messages yet.
    </p>
  );
}
