import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

export default function Admin() {
  const { user } = useSelector((state) => state?.auth);
  if (!user?.admin) return <Navigate to={"/"} replace />;

  return (
    <>
      <Outlet />
    </>
  );
}
