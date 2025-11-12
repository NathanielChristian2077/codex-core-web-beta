import { createBrowserRouter } from "react-router-dom";
import AppShell from "../components/ui/AppShell";
import RequireAuth from "../components/ui/RequireAuth";
import DashboardPage from "../pages/DashboardPage";
import LandingPage from "../pages/LandingPage";
import LoginPage from "../pages/LoginPage";
import TimelinePage from "../pages/TimelinePage";

export const router = createBrowserRouter([
  // público
  { path: "/", element: <LandingPage /> },
  { path: "/login", element: <LoginPage /> },

  // autenticado
  {
    element: <RequireAuth />,
    children: [
      {
        element: <AppShell />,
        children: [
          { path: "/dashboard", element: <DashboardPage /> },
          { path: "/campaigns/:id/timeline", element: <TimelinePage /> },
        ],
      },
    ],
  },

  // fallback opcional
  { path: "*", element: <LandingPage /> },
]);
