import { useEffect, useRef } from "react";
import MessageCard from "../cards/MessageCard";
import MessageCardSkeleton from "../skeletons/MessageCardSkeleton";
import type { PopulatedMessage } from "@/assets/types";

export default function MessagesList({
  messages,
  isLoading,
}: {
  messages: PopulatedMessage[];
  isLoading: boolean;
}) {
  const bottomRef: any = useRef(null);
  useEffect(() => {
    bottomRef?.current?.scrollIntoView({ behavior: "smooth" });
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
    <p className="text-sm text-muted-foreground text-center my-2">
      No messages yet.
    </p>
  );
}
