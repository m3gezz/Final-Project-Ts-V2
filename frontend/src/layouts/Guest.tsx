import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAppSelector } from "@/redux/store";

export default function Guest() {
  const { user, token } = useAppSelector((state) => state?.auth);
  const { pathname } = useLocation();

  if (!user?.email_verified_at && token && pathname !== "/verify-email")
    return <Navigate to={"/verify-email"} replace />;
  if (!token && pathname === "/verify-email")
    return <Navigate to={"/sign-up"} replace />;
  if (user?.email_verified_at && token) return <Navigate to={"/"} replace />;

  return <Outlet />;
}
