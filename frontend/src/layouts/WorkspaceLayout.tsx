import FloatingNav from "@/components/slices/FloatingNav";
import { Outlet } from "react-router-dom";

export default function WorkspaceLayout() {
  return (
    <main>
      <FloatingNav />
      <Outlet />
    </main>
  );
}
