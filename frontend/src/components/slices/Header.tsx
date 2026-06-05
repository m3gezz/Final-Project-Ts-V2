import { UsersIcon, type LucideIcon } from "lucide-react";

export default function Header({
  icon: Icon = UsersIcon,
  title,
  description,
  action,
}: {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <header className="mb-8 border-b pb-5 flex flex-wrap items-center justify-between gap-4 bg-linear-to-r from-transparent via-muted/5 to-transparent">
      <div className="flex items-center justify-between gap-4 w-full">
        <div className="space-y-1">
          <h1 className="flex items-center gap-2 text-2xl font-bold tracking-tight bg-linear-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
            <Icon className="h-10 w-10 text-foreground" /> {title}
          </h1>
          {description && (
            <p className="text-sm font-medium text-muted-foreground/90 max-w-2xl leading-relaxed">
              {description}
            </p>
          )}
        </div>
        <img
          src="/colab-logo-gradient.svg"
          alt="colab logo gradient"
          className="h-10"
        />
      </div>
      {action && (
        <div className="flex items-center gap-2 shrink-0 transition-all duration-300">
          {action}
        </div>
      )}
    </header>
  );
}
