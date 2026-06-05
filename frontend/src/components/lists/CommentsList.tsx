import CommentCard from "../cards/CommentCard";
import type { CommentType } from "@/assets/types";
import CommentCardSkeleton from "../skeletons/CommentCardSkeleton";
import NoContentCard from "../cards/NoContentCard";
import { MessagesSquare } from "lucide-react";

export default function CommentsList({
  comments,
  isLoading,
}: {
  comments: CommentType[];
  isLoading: boolean;
}) {
  return isLoading ? (
    <div className="max-h-60 space-y-2 overflow-auto my-2">
      {[...Array(2)].map((_, i) => (
        <CommentCardSkeleton key={i} />
      ))}
    </div>
  ) : comments?.length ? (
    <div className="mt-4 space-y-4">
      {comments?.map((c) => (
        <CommentCard key={c?.id} comment={c} />
      ))}
    </div>
  ) : (
    <NoContentCard
      icon={MessagesSquare}
      title="No comments yet"
      description="Be the first to comment on this project!"
    />
  );
}
