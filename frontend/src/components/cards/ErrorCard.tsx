import { useNavigate } from "react-router-dom";
import { ShieldX, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ForbiddenCardProps {
  title?: string;
  description?: string;
  fullPage?: boolean;
  className?: string;
  onBack?: () => void;
}

export default function ErrorCard({
  title = "Access forbidden",
  description = "You don't have permission to view this content. It may be private or restricted to its members.",
}: ForbiddenCardProps) {
  const nav = useNavigate();

  return (
    <div className="relative flex min-h-[70vh] items-center justify-center px-4 py-12">
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: "var(--gradient-hero)" }}
        aria-hidden="true"
      />
      <div className="relative">
        <div
          className={
            "relative w-full max-w-md rounded-2xl border bg-card p-8 text-center ring-1 ring-destructive/20"
          }
          style={{ boxShadow: "var(--shadow-elegant)" }}
          role="alert"
          aria-live="polite"
        >
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-destructive/10">
            <ShieldX className="h-7 w-7 text-destructive" aria-hidden="true" />
          </div>
          <h2 className="mt-5 text-xl font-semibold tracking-tight">{title}</h2>
          <p className="mt-2 text-sm text-muted-foreground">{description}</p>
          <div className="mt-6 flex justify-center">
            <Button onClick={() => nav(-1)} variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Go back
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
