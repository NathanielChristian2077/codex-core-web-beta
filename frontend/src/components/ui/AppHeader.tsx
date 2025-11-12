import { Link, useLocation } from "react-router-dom";
import { useSession } from "../../store/useSession";

export default function AppHeader() {
  const loc = useLocation();
  const { isLogged, logout } = useSession();

  return (
    <header className="sticky top-0 z-10 border-b bg-white/60 backdrop-blur supports-[backdrop-filter]:bg-white/40 dark:bg-zinc-900/60">
      <div className="mx-auto flex h-14 max-w-6x1 items-center justify-between px-4">
        <Link to="/" className="text-sm font-semibold tracking-tight">
          Codex Core
        </Link>
        <nav className="flex items-center gap-3 text-sm">
          <Link to="/" className={linkCls(loc.pathname === "/")}>
            Home
          </Link>
          {isLogged ? (
            <>
              <Link
                to="/dashboard"
                className={linkCls(loc.pathname.startsWith("/dashboard"))}
              >
                Dashboard
              </Link>
              <button
                onClick={logout}
                className="cursor-pointer rounded border px-3 py-1.5 hover:bg-zinc-50 dark:hover:bg-zinc-800"
              >
                Sign out
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className={linkCls(loc.pathname.startsWith("/login"))}
            >
              Login
            </Link>
          )}
          <a
            href="https://github.com/NathanielChristian2077/trabalho-final-web-dev.git"
            className="rounded px-3 py-1.5 hover:underline"
          >
            GitHub
          </a>
        </nav>
      </div>
    </header>
  );
}

function linkCls(active: boolean) {
  return [
    "rounded px-3 py-1.5 hover:bg-zinc-50 dark:hover:bg-zinc-800",
    active ? "font-semibold" : "text-zinc-600 dark:text-zinc-300",
  ].join(" ");
}
