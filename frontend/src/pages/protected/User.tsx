import { Link, useParams } from "react-router-dom";
import { Laptop, Pencil } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { getUser } from "@/api/functions/users";
import { getImageUrl } from "@/lib/utils";
import ProjectsList from "@/components/lists/ProjectsList";
import ErrorCard from "@/components/cards/ErrorCard";
import UserSkeleton from "@/components/skeletons/UserSkeleton";
import type { DataType } from "@/assets/types";
import { useAppSelector } from "@/redux/store";
import BadgeCard from "@/components/cards/BadgeCard";

export default function User() {
  const { id } = useParams();
  const { user } = useAppSelector((state) => state?.auth);
  const {
    data: profile,
    isLoading: isProfileLoading,
    isError: isProfileError,
  } = useQuery({
    queryKey: ["profile", id],
    queryFn: () => getUser(id),
    retry: 0,
  });

  if (isProfileLoading) return <UserSkeleton />;
  if (isProfileError) return <ErrorCard />;
  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <div className="rounded-2xl border bg-card p-8">
        <div className="flex flex-wrap flex-col md:flex-row items-start gap-6">
          <Avatar className="h-24 w-24">
            <AvatarImage src={getImageUrl(profile?.avatar)} />
            <AvatarFallback>{profile?.full_name[0]}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-semibold tracking-tight">
              {profile?.full_name}{" "}
            </h1>
            <p className="text-muted-foreground flex items-center gap-2">
              <Laptop className="w-4 h-4" /> {profile?.professional_title}
            </p>
            <p className="text-muted-foreground">@{profile?.username}</p>
            <p className="mt-3 max-w-2xl">{profile?.bio}</p>
            <div className="mt-4 flex flex-wrap gap-1.5">
              {profile?.skills?.map((s: DataType) => (
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
          <div className="mt-3 space-y-2 max-h-50 overflow-y-scroll">
            {profile?.badges?.length === 0 && (
              <p className="text-sm text-muted-foreground">No badges yet.</p>
            )}
            {profile?.badges?.map((b: DataType) => (
              <BadgeCard key={b?.id} badge={b} />
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
          <ProjectsList
            projects={profile?.owned}
            isLoading={isProfileLoading}
          />
        </TabsContent>
        <TabsContent value="joined" className="mt-6">
          <ProjectsList
            projects={profile?.worked}
            isLoading={isProfileLoading}
          />
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
