import { useEffect, useRef } from "react";
import MessageCard from "../cards/MessageCard";

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
    <div className="mt-6 space-y-3">loading</div>
  ) : messages?.length ? (
    <div className="flex-1 h-full space-y-4 overflow-auto p-4">
      {messages?.map((m) => (
        <MessageCard key={m?.id} message={m} />
      ))}
      <div ref={bottomRef} />
    </div>
  ) : (
    <>nothing</>
  );
}
