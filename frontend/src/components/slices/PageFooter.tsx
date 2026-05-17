import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { PaginationState } from "@/assets/types";

export default function PageFooter({
  pagination,
  setPagination,
  isLoading,
}: {
  pagination: PaginationState;
  setPagination: React.Dispatch<React.SetStateAction<PaginationState>>;
  isLoading: boolean;
}) {
  return (
    <div className="mt-10 flex justify-center gap-2">
      <Button
        onClick={() => {
          if (pagination?.current_page <= 1) return;
          setPagination((prev) => ({
            ...prev,
            current_page: prev?.current_page - 1,
          }));
        }}
        disabled={pagination?.current_page <= 1 || isLoading}
        variant={"outline"}
        size="sm"
        className="h-9 w-9 rounded-full p-0"
      >
        <ChevronLeft />
      </Button>
      <Button
        variant={"default"}
        size="sm"
        className="h-9 w-9 rounded-full p-0"
      >
        {pagination?.current_page}
      </Button>
      <Button
        onClick={() => {
          if (pagination?.current_page >= pagination?.last_page) return;
          setPagination((prev) => ({
            ...prev,
            current_page: prev?.current_page + 1,
          }));
        }}
        disabled={
          pagination?.current_page >= pagination?.last_page || isLoading
        }
        variant={"outline"}
        size="sm"
        className="h-9 w-9 rounded-full p-0"
      >
        <ChevronRight />
      </Button>
    </div>
  );
}
