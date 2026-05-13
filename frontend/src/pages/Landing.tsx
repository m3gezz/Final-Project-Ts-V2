import { Link } from "react-router-dom";
import {
  ArrowRight,
  FolderKanban,
  MessagesSquare,
  Users,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Landing() {
  return (
    <div className="min-h-screen">
      <section className="relative overflow-hidden">
        <div
          className="pointer-events-none absolute inset-0"
          style={{ background: "var(--gradient-hero)" }}
        />
        <div className="relative mx-auto max-w-5xl px-6 pt-24 pb-20 text-center">
          <span
            className="inline-flex items-center gap-2 rounded-full border bg-card px-3 py-1 text-xs text-muted-foreground"
            style={{ boxShadow: "var(--shadow-soft)" }}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-primary" /> New:
            private workspaces are here
          </span>
          <h1 className="mt-6 text-5xl font-semibold tracking-tight md:text-6xl">
            Where great{" "}
            <span
              style={{
                background: "var(--gradient-primary)",
                WebkitBackgroundClip: "text",
                color: "transparent",
              }}
            >
              project ideas
            </span>{" "}
            find their team.
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-muted-foreground">
            Share an idea, find collaborators, and ship it together inside
            private workspaces with chat, tasks, and files — all in one place.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg">
              <Link to="/sign-up">
                Start for free <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/sign-in">Login</Link>
            </Button>
          </div>
        </div>
      </section>

      <section id="features" className="mx-auto max-w-7xl px-6 py-20">
        <div className="grid gap-6 md:grid-cols-4">
          {[
            {
              icon: FolderKanban,
              title: "Discover ideas",
              desc: "Browse projects by category, skill or community.",
            },
            {
              icon: Users,
              title: "Build your team",
              desc: "Send invites or accept join requests in one click.",
            },
            {
              icon: MessagesSquare,
              title: "Collaborate privately",
              desc: "Chat, tasks, files — all in a project workspace.",
            },
            {
              icon: ShieldCheck,
              title: "Yours, secured",
              desc: "Workspaces are private. Your ideas stay yours.",
            },
          ].map((f) => (
            <div key={f.title} className="rounded-xl border bg-card p-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-semibold">{f.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t">
        <div className="mx-auto max-w-7xl px-6 py-8 text-sm text-muted-foreground">
          © {new Date().getFullYear()} Collab. Built for makers.
        </div>
      </footer>
    </div>
  );
}
