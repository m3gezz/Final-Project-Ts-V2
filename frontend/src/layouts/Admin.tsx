import { useAppSelector } from "@/redux/store";
import { Navigate, Outlet } from "react-router-dom";

export default function Admin() {
  const { user } = useAppSelector((state) => state?.auth);
  if (!user?.admin) return <Navigate to={"/"} replace />;

  return (
    <>
      <Outlet />
    </>
  );
}
