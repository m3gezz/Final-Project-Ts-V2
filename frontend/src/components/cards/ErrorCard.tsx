import { ShieldX, ArrowLeft, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

interface ErrorCardProps {
  title?: string;
  description?: string;
  code?: string;
  className?: string;
}

export default function ErrorCard({
  title = "Access forbidden",
  description = "You don't have permission to view this content. It may be private or restricted to its members.",
  code = "403",
  className,
}: ErrorCardProps) {
  const nav = useNavigate();
  return (
    <div className="relative flex min-h-[70vh] items-center justify-center px-4 py-12">
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
      />
      <div className="relative">
        <div
          className={cn(
            "group relative w-full max-w-md overflow-hidden rounded-3xl border bg-card/80 backdrop-blur",
            "p-8 text-center transition-all",
            className,
          )}
          role="alert"
          aria-live="polite"
        >
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.04]"
            aria-hidden="true"
          />

          <div
            className="pointer-events-none absolute -top-24 left-1/2 h-56 w-56 -translate-x-1/2 rounded-full opacity-60 blur-3xl"
            aria-hidden="true"
          />

          <div className="relative">
            <div className="relative mx-auto h-20 w-20">
              <div className="absolute inset-0 animate-ping rounded-full bg-destructive/20" />
              <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl border border-destructive/30 bg-destructive/10 ring-1 ring-inset ring-destructive/20">
                <ShieldX
                  className="h-9 w-9 text-destructive"
                  aria-hidden="true"
                />
                <span className="absolute -bottom-1.5 -right-1.5 flex h-7 w-7 items-center justify-center rounded-full border border-destructive/40 bg-card text-destructive shadow-sm">
                  <Lock className="h-3.5 w-3.5" />
                </span>
              </div>
            </div>

            <div className="mt-5 flex items-center justify-center gap-2">
              <span className="rounded-full border border-destructive/30 bg-destructive/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-destructive">
                {code}
              </span>
              <span className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
                Restricted
              </span>
            </div>

            <h2 className="mt-3 text-2xl font-semibold tracking-tight">
              {title}
            </h2>
            <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
              {description}
            </p>

            <div className="mt-7 flex items-center justify-center gap-2">
              <Button
                onClick={() => nav("/")}
                variant="outline"
                className="rounded-full"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Go back
              </Button>
              <Button
                onClick={() => nav("/")}
                variant="ghost"
                className="rounded-full text-muted-foreground hover:text-foreground"
              >
                Home
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
