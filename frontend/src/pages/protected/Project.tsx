import { useState } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import { Heart, Send, UserPlus, MessageCircle, Pencil } from "lucide-react";
import { findProject, findUser } from "@/app/mock-data";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export default function Project() {
  const { id } = useParams();
  const project = findProject(id || "");
  const [liked, setLiked] = useState(project?.liked || false);
  const [comment, setComment] = useState("");
  const [requested, setRequested] = useState(false);

  if (!project) return <Navigate to="/projects" replace />;
  const owner = findUser(project.ownerId);

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <div
        className="overflow-hidden rounded-2xl border"
        style={{ boxShadow: "var(--shadow-soft)" }}
      >
        <div className="aspect-[21/9] bg-muted">
          <img
            src={project.image}
            alt={project.title}
            className="h-full w-full object-cover"
          />
        </div>
        <div className="bg-card p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <Badge variant="secondary" className="mb-2">
                {project.category}
              </Badge>
              <h1 className="text-3xl font-semibold tracking-tight">
                {project.title}
              </h1>
              <Link
                to={`/users/${owner.id}`}
                className="mt-3 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
              >
                <Avatar className="h-6 w-6">
                  <AvatarImage src={owner.avatar} />
                  <AvatarFallback>{owner.full_name[0]}</AvatarFallback>
                </Avatar>
                {owner.full_name}
              </Link>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setLiked(!liked)}>
                <Heart
                  className={`mr-2 h-4 w-4 ${liked ? "fill-primary text-primary" : ""}`}
                />
                {project.likes + (liked ? 1 : 0)}
              </Button>
              <Button asChild variant="outline">
                <Link to={`/projects/${project.id}/edit`}>
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit
                </Link>
              </Button>
              <Button
                onClick={() => {
                  setRequested(true);
                  toast.success("Join request sent");
                }}
                disabled={requested}
              >
                <UserPlus className="mr-2 h-4 w-4" />
                {requested ? "Request sent" : "Request to join"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="space-y-6 md:col-span-2">
          <section className="rounded-xl border bg-card p-6">
            <h2 className="text-lg font-semibold">About</h2>
            <p className="mt-2 text-muted-foreground">{project.description}</p>
          </section>
          <section className="rounded-xl border bg-card p-6">
            <h2 className="text-lg font-semibold">Manifesto</h2>
            <p className="mt-2 italic text-muted-foreground">
              "{project.manifesto}"
            </p>
          </section>
          <section className="rounded-xl border bg-card p-6">
            <h2 className="flex items-center gap-2 text-lg font-semibold">
              <MessageCircle className="h-4 w-4" />
              Comments ({project.comments.length})
            </h2>
            <div className="mt-4 space-y-4">
              {project.comments.map((c) => {
                const u = findUser(c.userId);
                return (
                  <div key={c.id} className="flex gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={u.avatar} />
                      <AvatarFallback>{u.full_name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 rounded-lg bg-muted/50 p-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium">{u.full_name}</span>
                        <span className="text-xs text-muted-foreground">
                          {c.at}
                        </span>
                      </div>
                      <p className="mt-1 text-sm">{c.text}</p>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-4 flex gap-2">
              <Textarea
                placeholder="Leave a comment…"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={2}
              />
              <Button
                onClick={() => {
                  if (!comment.trim()) return;
                  toast.success("Comment posted");
                  setComment("");
                }}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </section>
        </div>

        <aside className="space-y-6">
          <section className="rounded-xl border bg-card p-6">
            <h3 className="text-sm font-semibold text-muted-foreground">
              Skills required
            </h3>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {project.skills.map((s) => (
                <Badge key={s} variant="secondary">
                  {s}
                </Badge>
              ))}
            </div>
          </section>
          <section className="rounded-xl border bg-card p-6">
            <h3 className="text-sm font-semibold text-muted-foreground">
              Members ({project.members.length})
            </h3>
            <div className="mt-3 space-y-3">
              {project.members.map((id) => {
                const u = findUser(id);
                return (
                  <Link
                    key={id}
                    to={`/users/${u.id}`}
                    className="flex items-center gap-3 rounded-lg p-2 hover:bg-muted"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={u.avatar} />
                      <AvatarFallback>{u.full_name[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="text-sm font-medium">{u.full_name}</div>
                      <div className="text-xs text-muted-foreground">
                        @{u.username}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}
