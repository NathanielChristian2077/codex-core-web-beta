import { createBrowserRouter } from 'react-router-dom'
import RequireAuth from '../components/RequireAuth'
import DashboardPage from '../pages/DashboardPage'
import LoginPage from '../pages/LoginPage'
import TimelinePage from '../pages/TimelinePage'
import LandingPage from '../pages/LandingPage'


export const router = createBrowserRouter([
    { path: "/", element: <LandingPage /> },
    { path: "/login", element: <LoginPage /> },
    {
        element: <RequireAuth />,
        children: [
            { path: "/dashboard", element: <DashboardPage /> },
            { path: "/campaigns/:id/timeline", element: <TimelinePage /> },
        ],
    },
]);