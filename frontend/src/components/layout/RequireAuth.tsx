import { useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useSession } from "../../store/useSession";
import Spinner from "./Spinner";

// Garante que a sessão é carregada uma única vez no boot da app.
let bootstrapped = false;

export default function RequireAuth() {
  const { isLogged, loading } = useSession();

  useEffect(() => {
    if (!bootstrapped) {
      bootstrapped = true;
      useSession.getState().loadSession();
    }
  }, []);

  // Enquanto o GET /auth/me não respondeu, não decide nada (evita jogar
  // o usuário para /login num refresh com cookie válido).
  if (loading) {
    return (
      <div className="grid min-h-dvh place-items-center">
        <Spinner size={28} />
      </div>
    );
  }

  if (!isLogged) return <Navigate to="/login" replace />;
  return <Outlet />;
}
