import { Link, useParams } from "react-router-dom";
import { Pencil } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { getUser } from "@/api/functions/user";
import { getImageUrl } from "@/lib/utils";
import ProjectsList from "@/components/lists/ProjectsList";
import ErrorCard from "@/components/cards/ErrorCard";
import UserSkeleton from "@/components/skeletons/UserSkeleton";

export default function User() {
  const { id } = useParams();
  const { user } = useSelector((state) => state?.auth);

  const {
    data: profile,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["profile", id],
    queryFn: () => getUser(id),
    retry: 0,
    staleTime: 1000 * 60 * 10,
  });

  if (isLoading) return <UserSkeleton />;
  if (isError) return <ErrorCard />;
  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <div
        className="rounded-2xl border bg-card p-8"
        style={{ boxShadow: "var(--shadow-soft)" }}
      >
        <div className="flex flex-wrap flex-col md:flex-row items-start gap-6">
          <Avatar className="h-24 w-24">
            <AvatarImage src={getImageUrl(profile?.avatar)} />
            <AvatarFallback>{profile?.full_name[0]}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-semibold tracking-tight">
              {profile?.full_name}
            </h1>
            <p className="text-muted-foreground">@{profile?.username}</p>
            <p className="mt-3 max-w-2xl">{profile?.bio}</p>
            <div className="mt-4 flex flex-wrap gap-1.5">
              {profile?.skills?.map((s) => (
                <Badge key={s?.id} variant="secondary">
                  {s?.label}
                </Badge>
              ))}
            </div>
          </div>
          {id == user?.id && (
            <Button asChild variant="outline">
              <Link to="/profile-edit">
                <Pencil className="mr-2 h-4 w-4" />
                Edit profile
              </Link>
            </Button>
          )}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="rounded-xl border bg-card p-6 md:col-span-2">
          <h2 className="text-lg font-semibold">About</h2>
          <p className="mt-2 text-muted-foreground">{profile?.about}</p>
        </div>
        <div className="rounded-xl border bg-card p-6">
          <h2 className="text-lg font-semibold">Badges</h2>
          <div className="mt-3 space-y-2">
            {profile?.badges?.length === 0 && (
              <p className="text-sm text-muted-foreground">No badges yet.</p>
            )}
            {profile?.badges?.map((b) => (
              <div
                key={b.name}
                className="flex items-center gap-3 rounded-lg border bg-muted/30 p-3"
              >
                <span className="text-xl">{b.emoji}</span>
                <span className="text-sm font-medium">{b.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Tabs defaultValue="owned" className="flex flex-col">
        <TabsList>
          <TabsTrigger value="owned">
            Owned ({profile?.owned_count ?? 0})
          </TabsTrigger>
          <TabsTrigger value="joined">
            Joined ({profile?.worked_count ?? 0})
          </TabsTrigger>
        </TabsList>
        <TabsContent value="owned" className="mt-6">
          <ProjectsList projects={profile?.owned} isLoading={isLoading} />
        </TabsContent>
        <TabsContent value="joined" className="mt-6">
          <ProjectsList projects={profile?.worked} isLoading={isLoading} />
        </TabsContent>
        <p className="w-fit mx-auto text-sm text-muted-foreground">
          For more search the users name{" "}
          <Link className="text-primary hover:underline" to={"/projects"}>
            Here
          </Link>
        </p>
      </Tabs>
    </div>
  );
}
