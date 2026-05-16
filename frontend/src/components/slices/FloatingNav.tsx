import {
  KanbanSquare,
  LayoutDashboard,
  MessageSquare,
  UsersIcon,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

export default function FloatingNav() {
  const { id } = useParams();
  const [open, setOpen] = useState(false);
  const nav = useNavigate();
  const { pathname } = useLocation();
  const tabs = [
    { path: "", label: "Overview", icon: LayoutDashboard },
    { path: "/members", label: "Members", icon: UsersIcon },
    { path: "/chat", label: "Chat", icon: MessageSquare },
    { path: "/tasks", label: "Tasks", icon: KanbanSquare },
  ];

  useEffect(() => {
    setOpen(() => false);
  }, [pathname]);

  const ActiveIcon = tabs.find(
    (t) => pathname === `/workspaces/${id + t?.path}`,
  )?.icon;

  return (
    <div
      className={`fixed bottom-6 right-6 flex flex-col items-end z-40 gap-3`}
    >
      <div
        className={`flex flex-col items-end gap-2 transition-all duration-300 ${
          open
            ? "h-auto opacity-100 translate-y-0 pointer-events-auto"
            : "h-0 overflow-hidden opacity-0 translate-y-4 pointer-events-none"
        }`}
      >
        {tabs?.map((t, i) => {
          const to = `/workspaces/${id + t?.path}`;
          const active = pathname === to;
          return (
            <button
              key={i}
              onClick={() => nav(to)}
              style={{ transitionDelay: open ? `${i * 30}ms` : "0ms" }}
              className={`group flex items-center gap-2 rounded-full border bg-card pl-4 pr-2 py-2 text-sm shadow-lg transition-all hover:scale-105 ${active ? "border-primary text-primary" : "text-foreground"}`}
            >
              <span className="font-medium">{t?.label}</span>
              <span
                className={`flex h-8 w-8 items-center justify-center rounded-full transition-all ${active ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"}`}
              >
                <t.icon className="h-4 w-4" />
              </span>
            </button>
          );
        })}
      </div>
      <button
        onClick={() => setOpen((prev) => !prev)}
        aria-label="Toggle navigation"
        className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-xl transition-all hover:scale-110 active:scale-95"
      >
        <span
          className={`transition-transform duration-300 ${open ? "rotate-90" : ""}`}
        >
          {open ? (
            <X className="h-6 w-6" />
          ) : (
            <ActiveIcon className="h-6 w-6" />
          )}
        </span>
      </button>
    </div>
  );
}
