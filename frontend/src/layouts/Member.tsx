import { useAppSelector } from "@/redux/store";
import { Navigate, Outlet } from "react-router-dom";

export default function Member() {
  const { user } = useAppSelector((state) => state?.auth);
  if (user?.admin) return <Navigate to={"/dashboard"} replace />;

  return (
    <>
      <Outlet />
    </>
  );
}
