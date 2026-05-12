import React from "react";
import { Outlet } from "react-router-dom";

export default function WorkspaceLayout() {
  return (
    <div>
      workspace
      <Outlet />
    </div>
  );
}
