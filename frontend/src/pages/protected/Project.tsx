import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Heart, Send, UserPlus, MessageCircle, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { useMutation, useQueries, useQueryClient } from "@tanstack/react-query";
import {
  createComment,
  createProjectLike,
  getProject,
  getProjectComments,
} from "@/api/functions/projects";
import { getImageUrl } from "@/lib/utils";
import ErrorCard from "@/components/cards/ErrorCard";
import ProjectSkeleton from "@/components/skeletons/ProjectSkeleton";
import type {
  CommentType,
  DataType,
  MembershipType,
  ProjectType,
} from "@/assets/types";
import { createRequest } from "@/api/functions/requests";
import { useAppSelector } from "@/redux/store";
import CommentsList from "@/components/lists/CommentsList";
import UpdateCommentModal from "@/components/modals/UpdateCommentModal";

export default function Project() {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const [comment, setComment] = useState("");
  const { user } = useAppSelector((state) => state?.auth);
  const [
    { data: project, isLoading: isProjectLoading, isError: isProjectError },
    { data: comments, isLoading: isCommentsLoading },
  ] = useQueries({
    queries: [
      {
        queryKey: ["projects", id],
        queryFn: () => getProject(id),
        retry: 0,
      },
      {
        queryKey: ["project-comments", id],
        queryFn: () => getProjectComments(id),
        retry: 0,
      },
    ],
  });

  const {
    mutate: createProjectLikeMutation,
    isPending: isCreateProjectLikePending,
  } = useMutation({
    mutationFn: () => {
      return createProjectLike(id);
    },
    onMutate: () => {
      queryClient.cancelQueries();
      const previousProject = queryClient.getQueryData([
        "project",
        String(project?.id),
      ]);

      queryClient.setQueryData(
        ["project", String(project?.id)],
        (old: ProjectType) => ({
          ...old,
          isLiked: !old?.isLiked,
          likes_count: old?.isLiked
            ? old?.likes_count - 1
            : old?.likes_count + 1,
        }),
      );

      return { previousProject };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["project", String(project?.id)],
      });
    },
  });
  const { mutate: createRequestMutation, isPending: isCreateRequestPending } =
    useMutation({
      mutationFn: () => createRequest({ project_id: id }),
      onMutate: () => {
        queryClient.cancelQueries();
        const previousProject = queryClient.getQueryData([
          "project",
          String(id),
        ]);
        queryClient.setQueryData(
          ["project", String(id)],
          (old: ProjectType) => ({
            ...old,
            isRequested: true,
          }),
        );
        return { previousProject };
      },
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["project", String(id)],
        });
        queryClient.invalidateQueries({
          queryKey: ["requests"],
        });
      },
    });
  const { mutate: createCommentMutation, isPending: isCreateCommentPending } =
    useMutation({
      mutationFn: (data: string) =>
        createComment({ project_id: id, content: data }),
      onMutate: () => {
        queryClient.cancelQueries();
        setComment("");
        const previousProject = queryClient.getQueryData([
          "project-comments",
          String(id),
        ]);
        queryClient.setQueryData(
          ["project-comments", String(id)],
          (old: CommentType[]) => {
            const now = new Date();
            return [
              {
                id: Date.now(),
                content: comment,
                user,
                created_at: now,
                updated_at: now,
              },
              ...old,
            ];
          },
        );
        return { previousProject };
      },
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["project-comments", String(id)],
        });
      },
    });

  if (isProjectLoading) return <ProjectSkeleton />;
  if (isProjectError) return <ErrorCard />;
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
                  if (isCreateProjectLikePending) return;
                  createProjectLikeMutation();
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
                !project?.isRequested && (
                  <Button
                    disabled={project?.isRequested || isCreateRequestPending}
                    onClick={() => {
                      if (isCreateRequestPending) return;
                      createRequestMutation();
                    }}
                  >
                    <UserPlus className="mr-2 h-4 w-4" />
                    Send request
                  </Button>
                )
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
            <p className="mt-2 italic text-muted-foreground line-clamp-2">
              "{project?.manifesto}"
            </p>
          </section>
          <section className="rounded-xl border bg-card p-6">
            <h2 className="flex items-center gap-2 text-lg font-semibold">
              <MessageCircle className="h-4 w-4" />
              Comments ({comments?.length})
            </h2>
            <div className="mt-4 flex gap-2">
              <Textarea
                placeholder="Leave a comment…"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={2}
              />
              <Button
                onClick={() => {
                  if (!comment.trim() || isCreateCommentPending) return;
                  createCommentMutation(comment);
                }}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            <CommentsList comments={comments} isLoading={isCommentsLoading} />
          </section>
        </div>

        <aside className="space-y-6">
          <section className="rounded-xl border bg-card p-6">
            <h3 className="text-sm font-semibold text-muted-foreground">
              Skills required
            </h3>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {project?.skills?.map((s: DataType) => (
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
              {project?.workspace?.memberships?.map((m: MembershipType) => {
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
      <UpdateCommentModal />
    </div>
  );
}
