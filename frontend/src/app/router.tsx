import { createBrowserRouter } from "react-router-dom";

import AppShell from "../components/ui/AppShell";
import RequireAuth from "../components/ui/RequireAuth";

import CharactersPage from "../pages/CharactersPage";
import DashboardPage from "../pages/DashboardPage";
import LandingPage from "../pages/LandingPage";
import LocationsPage from "../pages/LocationsPage";
import LoginPage from "../pages/LoginPage";
import ObjectsPage from "../pages/ObjectsPage";
import TimelinePage from "../pages/TimelinePage";

export const router = createBrowserRouter([
  // public
  { path: "/", element: <LandingPage /> },
  { path: "/login", element: <LoginPage /> },

  // after auth
  {
    element: <RequireAuth />,
    children: [
      {
        element: <AppShell />,
        children: [
          { path: "/dashboard", element: <DashboardPage /> },

          // timeline
          { path: "/campaigns/:id/timeline", element: <TimelinePage /> },


          { path: "/campaigns/:id/characters", element: <CharactersPage /> },
          { path: "/campaigns/:id/locations", element: <LocationsPage /> },
          { path: "/campaigns/:id/objects", element: <ObjectsPage /> },
        ],
      },
    ],
  },

  // fallback
  { path: "*", element: <LandingPage /> },
]);
