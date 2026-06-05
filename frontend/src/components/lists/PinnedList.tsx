import type { PopulatedMessage } from "@/assets/types";
import { Skeleton } from "../ui/skeleton";
import PinnedSkeleton from "../skeletons/PinnedSkeleton";
import { Pin, PinOff } from "lucide-react";
import NoContentCard from "../cards/NoContentCard";

export default function PinnedList({
  messages,
  isLoading,
}: {
  messages: PopulatedMessage[];
  isLoading: boolean;
}) {
  return isLoading ? (
    <article className="p-4">
      <Skeleton className="h-8 w-48 mb-6" />
      <ul>
        {[...Array(2)].map((_, i) => (
          <PinnedSkeleton key={i} />
        ))}
      </ul>
    </article>
  ) : (
    <section className="p-4">
      <h1 className="text-lg font-bold mb-4 flex items-center gap-1">
        <Pin className="h-6 w-6 text-accent" />
        Pinned messages
      </h1>
      <ul>
        {messages?.length ? (
          messages?.map((m: PopulatedMessage, i: number) => (
            <li key={i} className="flex items-start gap-2 border-l pb-4">
              <div className="-ml-1 h-2 w-2 bg-primary rounded-full mt-2" />
              <div
                onClick={() =>
                  document
                    .getElementById(`message-${m?.id}`)
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                className="cursor-pointer"
              >
                <h2>{m?.user?.full_name}</h2>
                <p className="italic text-xs border rounded-2xl w-full px-4 py-2 mt-2">
                  {m?.message}
                </p>
              </div>
            </li>
          ))
        ) : (
          <NoContentCard
            icon={PinOff}
            title="No pinned messages"
            description="Pin important messages to keep them at hand."
          />
        )}
      </ul>
    </section>
  );
}
