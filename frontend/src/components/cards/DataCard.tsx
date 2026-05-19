import React from "react";
import { Button } from "../ui/button";

export default function DataCard({ data }) {
  return (
    <div className="flex items-start justify-between gap-3 rounded-lg border bg-card/50 p-3">
      <div className="min-w-0">
        <div className="text-sm font-medium">{data?.label}</div>
        {data?.description && (
          <div className="mt-0.5 text-xs text-muted-foreground">
            {data?.description}
          </div>
        )}
      </div>
      <Button
        variant="ghost"
        size="icon"
        disabled={isDeleteDataPending}
        onClick={() => deleteDataMutation()}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}
