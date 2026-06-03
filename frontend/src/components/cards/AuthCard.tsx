import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

export default function AuthLCard({
  title,
  subtitle,
  children,
  footer,
  className,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative flex min-h-screen items-center justify-center px-4 py-12",
        className,
      )}
    >
      <div className="pointer-events-none absolute inset-0" />
      <div className="relative w-full max-w-md">
        <Link
          to="/welcome"
          className="flex items-center gap-2 min-w-0 truncate"
        >
          <img src="/colab-logo-gradient.svg" alt="" className="w-full h-10" />
        </Link>
        <div className="rounded-2xl border bg-card p-8">
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
            {subtitle && (
              <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
            )}
          </div>
          {children}
        </div>
        {footer && (
          <div className="mt-6 text-center text-sm text-muted-foreground">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
