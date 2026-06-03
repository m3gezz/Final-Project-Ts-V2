import { createBrowserRouter } from "react-router-dom";
import NotFound from "./pages/NotFound";
import SignUp from "./pages/Auth/SignUp";
import SignIn from "./pages/Auth/SignIn";
import VerifyEmail from "./pages/Auth/VerifyEmail";
import ForgotPassword from "./pages/Auth/ForgotPassword";
import VerifyResetCode from "./pages/Auth/VerifyResetCode";
import ResetPassword from "./pages/Auth/ResetPassword";
import Projects from "./pages/protected/Projects";
import Project from "./pages/protected/Project";
import Users from "./pages/protected/Users";
import UserEdit from "./pages/protected/UserEdit";
import Workspaces from "./pages/protected/Workspaces";
import Workspace from "./pages/protected/Workspace";
import Inbox from "./pages/protected/Inbox";
import Dashboard from "./pages/admin/Dashboard";
import Protected from "./layouts/Protected";
import Member from "./layouts/Member";
import Admin from "./layouts/Admin";
import Guest from "./layouts/Guest";
import Home from "./pages/protected/Home";
import User from "./pages/protected/User";
import Landing from "./pages/Landing";
import AboutUs from "./pages/AboutUs";
import Contact from "./pages/Contact";
import WorkspaceMembers from "./pages/protected/WorkspaceMembers";
import WorkspaceChat from "./pages/protected/WorkspaceChat";
import WorkspaceTasks from "./pages/protected/WorkspaceTasks";
import WorkspaceLayout from "./layouts/WorkspaceLayout";
import Populate from "./pages/admin/Populate";
import ProjectManipulator from "./pages/protected/ProjectManipulator";

const routes = [
  {
    path: "*",
    element: <NotFound />,
  },
  {
    path: "/about",
    element: <AboutUs />,
  },
  {
    path: "/contact",
    element: <Contact />,
  },
  {
    element: <Guest />,
    children: [
      {
        path: "/sign-up",
        element: <SignUp />,
      },
      {
        path: "/sign-in",
        element: <SignIn />,
      },
      {
        path: "/verify-email",
        element: <VerifyEmail />,
      },
      {
        path: "/forgot-password",
        element: <ForgotPassword />,
      },
      {
        path: "/verify-reset-code",
        element: <VerifyResetCode />,
      },
      {
        path: "/reset-password",
        element: <ResetPassword />,
      },
      {
        path: "/welcome",
        element: <Landing />,
      },
    ],
  },
  {
    path: "/",
    element: <Protected />,
    children: [
      {
        path: "projects",
        element: <Projects />,
      },
      {
        path: "projects/:id",
        element: <Project />,
      },
      {
        path: "users",
        element: <Users />,
      },
      {
        path: "users/:id",
        element: <User />,
      },
      {
        path: "profile-edit",
        element: <UserEdit />,
      },
      {
        element: <Member />,
        children: [
          {
            index: true,
            element: <Home />,
          },
          {
            path: "create-project",
            element: <ProjectManipulator mode="create" />,
          },
          {
            path: "projects/:id/edit",
            element: <ProjectManipulator mode="update" />,
          },
          {
            path: "workspaces",
            element: <Workspaces />,
          },
          {
            element: <WorkspaceLayout />,
            children: [
              {
                path: "workspaces/:id",
                element: <Workspace />,
              },
              {
                path: "workspaces/:id/members",
                element: <WorkspaceMembers />,
              },
              {
                path: "workspaces/:id/chat",
                element: <WorkspaceChat />,
              },
              {
                path: "workspaces/:id/tasks",
                element: <WorkspaceTasks />,
              },
            ],
          },
          { path: "inbox", element: <Inbox /> },
        ],
      },
      {
        element: <Admin />,
        children: [
          {
            path: "dashboard",
            element: <Dashboard />,
          },
          {
            path: "populate",
            element: <Populate />,
          },
        ],
      },
    ],
  },
];

export const router = createBrowserRouter(routes);
