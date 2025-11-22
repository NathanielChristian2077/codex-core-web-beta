import { Navigate, Outlet } from "react-router-dom";
import { useSession } from "../../store/useSession";

export default function RequireAuth() {
  const { isLogged } = useSession();
  if (!isLogged) return <Navigate to="/login" replace />;
  return <Outlet />;
}
