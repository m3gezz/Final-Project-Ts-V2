import { Skeleton } from "../ui/skeleton";

export default function CommentCardSkeleton() {
  return (
    <div className="flex gap-3 w-full">
      {/* User Profile Avatar Placeholder */}
      <Skeleton className="h-8 w-8 rounded-full shrink-0" />

      {/* Main Comment Box Box Shell Layout */}
      <div className="flex-1 rounded-lg bg-muted/30 p-3 space-y-3">
        {/* Top bar header row with metadata properties */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {/* User Profile Full Name Identifier */}
            <Skeleton className="h-4 w-24" />
            {/* Muted edited state label placeholder */}
            <Skeleton className="h-3 w-10" />
          </div>
          {/* Formatted Timestamp Field Wrapper */}
          <Skeleton className="h-3 w-14" />
        </div>

        {/* Content Paragraph Block Paragraphs */}
        <div className="space-y-1.5 pt-1">
          <Skeleton className="h-4 w-11/12" /> {/* Content Row 1 */}
          <Skeleton className="h-4 w-4/5" /> {/* Content Row 2 */}
        </div>
      </div>
    </div>
  );
}
