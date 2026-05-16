import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Heart, Send, UserPlus, MessageCircle, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import SendRequestModal from "@/components/modals/SendRequestModal";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { getProject, likeProject } from "@/api/functions/project";
import { getImageUrl } from "@/lib/utils";
import ErrorCard from "@/components/cards/ErrorCard";
import ProjectSkeleton from "@/components/skeletons/ProjectSkeleton";

export default function Project() {
  const { id } = useParams();
  const { user } = useSelector((state) => state?.auth);
  const {
    data: project,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["project", id],
    queryFn: () => getProject(id),
    retry: 0,
    staleTime: 1000 * 60 * 10,
  });

  const queryClient = useQueryClient();
  const { mutate: like, isPending } = useMutation({
    mutationFn: () => {
      return likeProject(id);
    },
    onMutate: () => {
      const previousProject = queryClient.getQueryData([
        "project",
        String(project?.id),
      ]);

      queryClient.setQueryData(["project", String(project?.id)], (old) => ({
        ...old,
        isLiked: !old.isLiked,
        likes_count: old.isLiked ? old.likes_count - 1 : old.likes_count + 1,
      }));

      return { previousProject };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["project", String(project?.id)],
      });
    },
  });

  const [comment, setComment] = useState("");
  console.log(project);

  if (isLoading) return <ProjectSkeleton />;
  if (isError) return <ErrorCard />;
  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <div
        className="overflow-hidden rounded-2xl border"
        style={{ boxShadow: "var(--shadow-soft)" }}
      >
        <div className="aspect-21/9 bg-muted">
          <img
            src={getImageUrl(project?.image)}
            alt={project?.title}
            className="h-full w-full object-cover"
          />
        </div>
        <div className="bg-card p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <Badge variant="secondary" className="mb-2">
                {project?.category?.label}
              </Badge>
              <h1 className="text-3xl font-semibold tracking-tight">
                {project?.title}
              </h1>
              <Link
                to={`/users/${project?.user?.id}`}
                className="mt-3 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
              >
                <Avatar className="h-6 w-6">
                  <AvatarImage src={getImageUrl(project?.user?.avatar)} />
                  <AvatarFallback>
                    {project?.user?.full_name?.[0]}
                  </AvatarFallback>
                </Avatar>
                {project?.user?.full_name}
              </Link>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  if (isPending) return;
                  like();
                }}
              >
                <Heart
                  className={`mr-2 h-4 w-4 ${project?.isLiked ? "fill-primary text-primary" : ""}`}
                />
                {project?.likes_count}
              </Button>
              {project?.user?.id === user?.id ? (
                <Button asChild variant="outline">
                  <Link to={`/projects/${project.id}/edit`}>
                    <Pencil className="mr-2 h-4 w-4" />
                    Edit
                  </Link>
                </Button>
              ) : (
                <Dialog>
                  {!project?.isRequested && (
                    <DialogTrigger asChild>
                      <Button disabled={project?.isRequested}>
                        <UserPlus className="mr-2 h-4 w-4" />
                        Send request
                      </Button>
                    </DialogTrigger>
                  )}
                  <SendRequestModal project_id={id} />
                </Dialog>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="space-y-6 md:col-span-2">
          <section className="rounded-xl border bg-card p-6">
            <h2 className="text-lg font-semibold">About</h2>
            <p className="mt-2 text-muted-foreground">{project?.description}</p>
          </section>
          <section className="rounded-xl border bg-card p-6">
            <h2 className="text-lg font-semibold">Manifesto</h2>
            <p className="mt-2 italic text-muted-foreground">
              "{project?.manifesto}"
            </p>
          </section>
          <section className="rounded-xl border bg-card p-6">
            <h2 className="flex items-center gap-2 text-lg font-semibold">
              <MessageCircle className="h-4 w-4" />
              Comments ({project?.comments_count})
            </h2>
            <div className="mt-4 space-y-4">
              {project?.comments?.map((c) => {
                return (
                  <div key={c.id} className="flex gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={c?.user?.avatar} />
                      <AvatarFallback>{c?.user?.full_name?.[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 rounded-lg bg-muted/50 p-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium">
                          {c?.user?.full_name}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {c?.id}
                        </span>
                      </div>
                      <p className="mt-1 text-sm">{c?.content}</p>
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
              {project?.skills?.map((s) => (
                <Badge key={s?.id} variant="secondary">
                  {s?.label}
                </Badge>
              ))}
            </div>
          </section>
          <section className="rounded-xl border bg-card p-6">
            <h3 className="text-sm font-semibold text-muted-foreground">
              Members ({project?.workspace?.memberships?.length})
            </h3>
            <div className="mt-3 space-y-3">
              {project?.workspace?.memberships?.map((m) => {
                return (
                  <Link
                    key={m?.id}
                    to={`/users/${m?.user?.id}`}
                    className="flex items-center gap-3 rounded-lg p-2 hover:bg-muted"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={getImageUrl(m?.user?.avatar)} />
                      <AvatarFallback>{m?.user?.full_name?.[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="text-sm font-medium">
                        {m?.user?.full_name}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        @{m?.user?.username}
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
