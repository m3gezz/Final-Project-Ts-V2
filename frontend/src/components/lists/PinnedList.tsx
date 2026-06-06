import type { PopulatedMessage } from "@/assets/types";
import { Skeleton } from "../ui/skeleton";
import PinnedSkeleton from "../skeletons/PinnedSkeleton";
import { File, Pin, PinOff } from "lucide-react";
import NoContentCard from "../cards/NoContentCard";
import { getImageUrl } from "@/lib/utils";

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
        <Pin className="h-6 w-6" />
        Recent Pinned messages
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
                className="cursor-pointer bg-muted p-2 rounded-md"
              >
                <h2>{m?.user?.full_name}</h2>
                {!!m?.message?.length && (
                  <p className="italic text-xs">{m?.message}</p>
                )}
                {!!m?.attachment && (
                  <>
                    <div className="aspect-video relative rounded-md overflow-hidden h-20">
                      {m?.attachment?.file_type === "image" && (
                        <img
                          src={getImageUrl(m?.attachment?.file_path)}
                          className="w-full h-full object-cover"
                        />
                      )}

                      {m?.attachment?.file_type === "video" && (
                        <video
                          src={getImageUrl(m?.attachment?.file_path)}
                          className="w-full h-full object-cover"
                        />
                      )}
                      {m?.attachment?.file_type === "document" && (
                        <div className="bg-muted w-full h-full rounded-lg flex flex-col items-center gap-4 p-2">
                          <File className="w-6 h-6" />
                          <div>
                            <h1>size: {m?.attachment?.file_size}Kb</h1>
                          </div>
                        </div>
                      )}
                    </div>
                    {m?.attachment?.file_name && (
                      <p className="italic text-xs truncate mt-1 text-accent">
                        {m?.attachment?.file_name}
                      </p>
                    )}
                  </>
                )}
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
