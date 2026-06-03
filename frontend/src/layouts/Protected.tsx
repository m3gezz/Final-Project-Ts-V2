import AppSidebar, {
  SidebarProvider,
  SidebarTrigger,
} from "@/components/slices/AppSidebar";
import { useAppSelector } from "@/redux/store";
import { Navigate, Outlet } from "react-router-dom";
import { Link } from "react-router-dom";

export default function Protected() {
  const { user, token } = useAppSelector((state) => state?.auth);
  if (!token) return <Navigate to={"/welcome"} replace />;
  if (!user?.email_verified_at && token)
    return <Navigate to={"/verify-email"} replace />;

  return (
    <SidebarProvider className="flex min-h-screen w-full bg-background">
      <AppSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="md:hidden flex items-center justify-between py-2 px-4">
          <SidebarTrigger />{" "}
          <Link to="/" className="flex items-center gap-2 min-w-0 truncate">
            <img src="/colab-logo-gradient.svg" alt="" className="w-full h-6" />
          </Link>
        </header>
        <main className="flex-1 p-4 md:p-8">
          <Outlet />
        </main>
      </div>
    </SidebarProvider>
  );
}
