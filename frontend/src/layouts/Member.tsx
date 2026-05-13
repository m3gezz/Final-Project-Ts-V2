import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

export default function Member() {
  const { user } = useSelector((state) => state?.auth);
  if (user?.admin) return <Navigate to={"/dashboard"} replace />;

  return (
    <>
      <Outlet />
    </>
  );
}
