import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export default function EmptyCard({
  icon: Icon,
  title,
  description,
  action,
  className,
}: {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl px-6 py-14 text-center backdrop-blur",
        className,
      )}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        aria-hidden="true"
      />

      <div
        className="pointer-events-none absolute left-1/2 top-0 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-50 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative mx-auto flex max-w-sm flex-col items-center gap-4">
        <div className="relative">
          <div
            className="absolute -inset-3 rounded-2xl opacity-30 blur-xl"
            aria-hidden="true"
          />
          <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl border bg-card ring-1 ring-inset ring-border">
            <div
              className="absolute inset-1 rounded-xl bg-accent/60"
              aria-hidden="true"
            />
            <Icon className="relative h-6 w-6 text-primary" />
          </div>
        </div>

        <div>
          <h3 className="text-base font-semibold tracking-tight">{title}</h3>
          {description && (
            <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
              {description}
            </p>
          )}
        </div>

        {action && <div className="mt-1">{action}</div>}
      </div>
    </div>
  );
}
