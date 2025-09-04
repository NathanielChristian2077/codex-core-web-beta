import { createBrowserRouter } from 'react-router-dom'
import DashboardPage from '../pages/DashboardPage'
import LoginPage from '../pages/LoginPage'
import TimelinePage from '../pages/TimelinePage'
import GraphPage from '../pages/GraphPage'


export const router = createBrowserRouter([
{ path: '/', element: <DashboardPage /> },
{ path: '/login', element: <LoginPage /> },
{ path: '/timeline', element: <TimelinePage /> },
{ path: '/graph', element: <GraphPage /> },
])