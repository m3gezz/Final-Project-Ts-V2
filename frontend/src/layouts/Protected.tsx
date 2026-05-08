import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

export default function Protected() {
  const { user, token } = useSelector((state) => state?.auth);

  if (!token) return <Navigate to={"/sign-in"} replace />;
  if (!user?.email_verified_at && token)
    return <Navigate to={"/verify-email"} replace />;

  return (
    <>
      <Outlet />
    </>
  );
}
