import { X, type LucideIcon } from "lucide-react";

export default function NoContentCard({
  icon: Icon = X,
  title = "No content",
  description = "There is no content to display here yet.",
  action,
}: {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col mt-4 items-center justify-center py-12 px-4 text-center">
      <div className="p-3 bg-muted rounded-full mb-3">
        <Icon />
      </div>
      <h3 className="text-sm font-semibold text-foreground">{title}</h3>
      <p className="text-xs text-muted-foreground/70 max-w-70 mt-1 mx-auto">
        {description}
      </p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
