import { Link, useParams } from "react-router-dom";
import { Pencil } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProjectCard from "@/components/cards/ProjectCard";
import { findUser, projects, users } from "@/data/exp";

export default function Profile() {
  const { id } = useParams();
  const u = id
    ? users.find((x) => x.id === id) || findUser("u1")
    : findUser("u1");
  const isMe = false;

  const owned = projects.filter((p) => p.ownerId === u.id);
  const joined = projects.filter(
    (p) => p.members.includes(u.id) && p.ownerId !== u.id,
  );

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <div
        className="rounded-2xl border bg-card p-8"
        style={{ boxShadow: "var(--shadow-soft)" }}
      >
        <div className="flex flex-wrap items-start gap-6">
          <Avatar className="h-24 w-24">
            <AvatarImage src={u.avatar} />
            <AvatarFallback>{u.full_name[0]}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-semibold tracking-tight">
              {u.full_name}
            </h1>
            <p className="text-muted-foreground">@{u.username}</p>
            <p className="mt-3 max-w-2xl">{u.bio}</p>
            <div className="mt-4 flex flex-wrap gap-1.5">
              {u.skills.map((s) => (
                <Badge key={s} variant="secondary">
                  {s}
                </Badge>
              ))}
            </div>
          </div>
          {isMe && (
            <Button asChild variant="outline">
              <Link to="/profile/edit">
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
          <p className="mt-2 text-muted-foreground">{u.about}</p>
        </div>
        <div className="rounded-xl border bg-card p-6">
          <h2 className="text-lg font-semibold">Badges</h2>
          <div className="mt-3 space-y-2">
            {u.badges.length === 0 && (
              <p className="text-sm text-muted-foreground">No badges yet.</p>
            )}
            {u.badges.map((b) => (
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

      <Tabs defaultValue="owned">
        <TabsList>
          <TabsTrigger value="owned">Owned ({owned.length})</TabsTrigger>
          <TabsTrigger value="joined">Joined ({joined.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="owned" className="mt-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {owned.map((p) => (
              <ProjectCard key={p.id} project={p} />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="joined" className="mt-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {joined.map((p) => (
              <ProjectCard key={p.id} project={p} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
