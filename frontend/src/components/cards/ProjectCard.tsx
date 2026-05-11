import { Link } from "react-router-dom";
import { Heart, MessageCircle } from "lucide-react";
import { type Project, findUser } from "@/data/exp";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { getImageUrl } from "@/lib/utils";

export default function ProjectCard({ project }: { project: Project }) {
  return (
    <Link
      to={`/projects/${project?.id}`}
      className="group flex flex-col overflow-hidden rounded-xl border bg-card transition-all hover:-translate-y-0.5"
      style={{ boxShadow: "var(--shadow-soft)" }}
    >
      <div className="relative aspect-video overflow-hidden bg-muted">
        <img
          src={getImageUrl(project?.image)}
          alt={project?.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <Badge className="absolute left-3 top-3 bg-background/90 text-foreground hover:bg-background">
          {project?.category?.label}
        </Badge>
      </div>
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div>
          <h3 className="font-semibold leading-tight group-hover:text-primary">
            {project?.title}
          </h3>
          <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
            {project?.description}
          </p>
        </div>
        <div className="mt-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Avatar className="h-6 w-6">
              <AvatarImage src={getImageUrl(project?.user?.avatar)} />
              <AvatarFallback>{project?.user?.full_name[0]}</AvatarFallback>
            </Avatar>
            <span className="text-xs text-muted-foreground">
              {project?.user?.full_name}
            </span>
          </div>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <Heart className="h-3.5 w-3.5" />
              {project?.likes_count}
            </span>
            <span className="inline-flex items-center gap-1">
              <MessageCircle className="h-3.5 w-3.5" />
              {project?.comments_count}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
