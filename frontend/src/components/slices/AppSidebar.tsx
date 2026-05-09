import { NavLink, useNavigate } from "react-router-dom";
import {
  Home,
  FolderKanban,
  Users,
  Inbox,
  Briefcase,
  Plus,
  Shield,
  LogOut,
  Sparkles,
  SidebarClose,
  SidebarOpen,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useDispatch, useSelector } from "react-redux";
import { useMutation } from "@tanstack/react-query";
import { signOut } from "@/api/apiFunctions";
import { createContext, useContext, useEffect, useState } from "react";
import { Spinner } from "../ui/spinner";
import { cn } from "@/lib/utils";

const items = [
  { to: "/", label: "Home", icon: Home, end: true },
  { to: "/projects", label: "Projects", icon: FolderKanban },
  { to: "/users", label: "Users", icon: Users },
  { to: "/workspaces", label: "Workspaces", icon: Briefcase },
  { to: "/inbox", label: "Inbox", icon: Inbox },
  { to: "/create-project", label: "Create Project", icon: Plus },
];

type SidebarContextType = {
  isOpen: boolean;
  isMobile: boolean;
  toggleSidebar: () => void;
};

type SidebarProps = {
  children?: React.ReactNode;
  className?: string;
};

export default function AppSidebar() {
  const { isOpen, isMobile } = useSidebar();
  const nav = useNavigate();
  const disp = useDispatch();
  const onMobile = `fixed top-0 ${isOpen ? "left-0" : "-left-64"}`;
  const onPc = `sticky top-0`;

  const defaultStyles = `h-screen z-20 flex ${isOpen ? "w-64" : "w-16"} shrink-0 flex-col border-r bg-sidebar text-sidebar-foreground transition-all ${isMobile ? onMobile : onPc}`;

  const { user } = useSelector((state) => state?.auth);
  const { mutate, isPending } = useMutation({
    mutationFn: () => signOut(disp),
  });

  return (
    <aside className={defaultStyles}>
      <div className="flex items-center justify-between p-3">
        <div className="flex items-center gap-2 min-w-0 truncate">
          <div
            className="flex h-8 w-8 items-center justify-center rounded-lg"
            style={{ background: "var(--gradient-primary)" }}
          >
            <Sparkles className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="text-lg font-semibold tracking-tight">Collab</span>
        </div>

        <SidebarTrigger />
      </div>

      <nav className="flex-1 px-3 space-y-1">
        {items.map((it) => (
          <NavLink
            key={it.to}
            to={it.to}
            end={it.end}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                  : "text-sidebar-foreground/80 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground"
              }`
            }
          >
            <it.icon className="min-h-4 min-w-4 max-h-4 max-w-4" />

            <span className={`min-w-0 truncate`}>{it.label}</span>
          </NavLink>
        ))}
        {user?.isAdmin && (
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                  : "text-sidebar-foreground/80 hover:bg-sidebar-accent/60"
              }`
            }
          >
            <Shield className="min-h-4 min-w-4 max-h-4 max-w-4" />
            <span className={`min-w-0 truncate`}>Dashboard</span>
          </NavLink>
        )}
      </nav>

      <div className="border-t p-3">
        <button
          onClick={() => nav(`/users/${user?.id}`)}
          className={`flex w-full items-center gap-3 ${isOpen && "p-2"} rounded-lg text-left hover:bg-sidebar-accent/60`}
        >
          <Avatar className="h-9 w-9">
            <AvatarImage src={user?.avatar} />
            <AvatarFallback>{user?.full_name?.[0]}</AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <div className="truncate text-sm font-medium">
              {user?.full_name}
            </div>
            <div className="truncate text-xs text-muted-foreground">
              @{user?.username}
            </div>
          </div>
        </button>
        <Button
          variant="ghost"
          size="sm"
          className="mt-2 w-full justify-start"
          onClick={() => mutate()}
          disabled={isPending}
        >
          {isPending ? <Spinner /> : <LogOut className="mr-2 h-4 w-4" />}
          <span className={`min-w-0 truncate`}>
            {isPending ? "Signing out..." : "Sign out"}
          </span>
        </Button>
      </div>
    </aside>
  );
}

const SidebarTrigger = ({ className = "" }: { className?: string }) => {
  const { isOpen, toggleSidebar } = useSidebar();
  const defaultStyle = "px-3 py-2";

  return (
    <Button
      onClick={toggleSidebar}
      className={cn(defaultStyle, className)}
      variant={"ghost"}
    >
      {isOpen ? <SidebarClose /> : <SidebarOpen />}
    </Button>
  );
};

const sidebarContext = createContext<SidebarContextType | null>({
  isOpen: false,
  isMobile: window.innerWidth < 500,
  toggleSidebar: () => {},
});

const useSidebar = () => {
  const context = useContext(sidebarContext);

  if (!context) throw "useSidebar must me inside the SidebarProvider";

  return context;
};

const SidebarProvider = ({ children, className = "" }: SidebarProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth < 500);

  useEffect(() => {
    setIsMobile(window.innerWidth < 500);
  }, []);

  const toggleSidebar = () => {
    setIsOpen((prev) => !prev);
  };

  const defaultStyle = ``;

  return (
    <sidebarContext.Provider
      value={{
        isOpen,
        isMobile,
        toggleSidebar,
      }}
    >
      <main className={cn(defaultStyle, className)}>{children}</main>
    </sidebarContext.Provider>
  );
};

export { SidebarProvider, useSidebar, SidebarTrigger };
