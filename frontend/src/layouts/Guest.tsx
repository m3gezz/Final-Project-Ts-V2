import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Guest() {
  const { user, token } = useSelector((state) => state?.auth);
  const { pathname } = useLocation();

  if (!user?.email_verified_at && token && pathname !== "/verify-email")
    return <Navigate to={"/verify-email"} replace />;
  if (!token && pathname === "/verify-email")
    return <Navigate to={"/sign-up"} replace />;
  if (user?.email_verified_at && token) return <Navigate to={"/"} replace />;

  return (
    <>
      <Outlet />
    </>
  );
}
