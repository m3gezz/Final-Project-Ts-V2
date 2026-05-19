import CommentCard from "../cards/CommentCard";
import type { CommentType } from "@/assets/types";
import CommentCardSkeleton from "../skeletons/CommentCardSkeleton";

export default function CommentsList({
  comments,
  isLoading,
}: {
  comments: CommentType[];
  isLoading: boolean;
}) {
  return isLoading ? (
    <div className="max-h-60 space-y-2 overflow-auto">
      {[...Array(3)].map((_, i) => (
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
    <p className="text-sm text-muted-foreground text-center my-2">
      No comments yet.
    </p>
  );
}
