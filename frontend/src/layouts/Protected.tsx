// import AppSidebar from "@/components/slices/AppSidebar";
// import SidebarProvider, {
//   SidebarTrigger,
//   useSidebar,
// } from "@/components/ui/sidebar";
// import { Switch } from "@/components/ui/switch";
// import { toggleTheme } from "@/redux/themeSlice";
import { SidebarOpenIcon } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

export default function Protected() {
  //   const { mobile } = useSidebar();
  //   const disp = useDispatch();
  //   const { user, token } = useSelector((state) => state?.auth);
  //   const { theme } = useSelector((state) => state?.theme);

  //   if (!token) return <Navigate to={"/sign-in"} replace />;
  //   if (!user?.email_verified_at && token)
  //     return <Navigate to={"/verify-email"} replace />;

  return (
    <>
      <Outlet />
    </>
  );
}
