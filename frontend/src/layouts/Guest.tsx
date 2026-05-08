import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

export default function Guest() {
  //   const { user, token } = useSelector((state) => state?.auth);
  const { pathname } = useLocation();

  //   if (!user?.email_verified_at && token && pathname !== "/verify-email")
  //     return <Navigate to={"/verify-email"} replace />;
  //   if (!token && pathname === "/verify-email")
  //     return <Navigate to={"/sign-up"} replace />;
  //   if (user?.email_verified_at && token) return <Navigate to={"/"} replace />;

  return (
    <main className="bg-accent min-h-screen flex items-center justify-center p-2 lg:p-6">
      <Outlet />
    </main>
  );
}
