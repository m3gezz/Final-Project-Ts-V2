import type { DataType } from "@/assets/types";
import { BadgeIcon, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";

export default function BadgeCard({ badge }: { badge: DataType }) {
  const [open, setOpen] = useState(false);

  return (
    <article className="grid grid-cols-[20px_1fr] items-start gap-4 rounded-lg border bg-muted/30 p-3">
      <BadgeIcon className="w-6 h-6 text-brand-primary fill-brand-primary" />
      <div>
        <h1 className="text-brand-primary font-semibold flex items-start justify-between">
          {badge?.label}
          <Button
            className="text-brand-primary"
            variant={"link"}
            size={"icon-xs"}
            onClick={() => setOpen((prev) => !prev)}
          >
            {open ? <ChevronUp /> : <ChevronDown />}
          </Button>
        </h1>
        <p
          className={`text-xs italic overflow-hidden ${open ? "block" : "hidden"} transition-all`}
        >
          {badge?.description}
        </p>
      </div>
    </article>
  );
}
