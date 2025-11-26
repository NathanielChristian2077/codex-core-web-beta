import { Github, Home, LayoutDashboard, LogIn, LogOut } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useSession } from "../../store/useSession";

export default function AppHeader() {
  const loc = useLocation();

  const token = useSession((s) => s.token);
  const logout = useSession((s) => s.logout);
  const isLogged = !!token;

  return (
    <header className="sticky top-0 z-20 border-b bg-white/70 backdrop-blur-md dark:bg-zinc-900/60">
      <div className="mx-auto flex h-14 w-full max-w-screen-2xl items-center justify-between px-6">
        {/* Logo */}
        <Link
          to="/"
          className="flex gap-3 text-lg font-semibold tracking-tight hover:opacity-80 transition items-center"
        >
          <img src="/CodexCoreB.svg" className="h-8 w-8" />
          Codex Core
        </Link>

        {/* Nav */}
        <nav className="flex items-center gap-3 text-sm">
          <NavLink
            to="/"
            active={loc.pathname === "/"}
            label="Home"
            icon={<Home className="h-4 w-4" />}
          />

          {isLogged ? (
            <>
              <NavLink
                to="/dashboard"
                active={loc.pathname.startsWith("/dashboard")}
                label="Dashboard"
                icon={<LayoutDashboard className="h-4 w-4" />}
              />

              <button
                onClick={logout}
                className="flex items-center gap-2 rounded-md border px-3 py-1.5 text-zinc-700 hover:bg-zinc-100 dark:text-zinc-200 dark:border-zinc-700 dark:hover:bg-zinc-800 transition"
              >
                <LogOut className="h-4 w-4" />
                Sign out
              </button>
            </>
          ) : (
            <NavLink
              to="/login"
              active={loc.pathname.startsWith("/login")}
              label="Login"
              icon={<LogIn className="h-4 w-4" />}
            />
          )}

          <a
            href="https://github.com/NathanielChristian2077/trabalho-final-web-dev.git"
            target="_blank"
            className="flex items-center gap-2 rounded-md px-3 py-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
          >
            <Github className="h-4 w-4" />
            GitHub
          </a>
        </nav>
      </div>
    </header>
  );
}

function NavLink({
  to,
  label,
  active,
  icon,
}: {
  to: string;
  label: string;
  active: boolean;
  icon?: React.ReactNode;
}) {
  return (
    <Link
      to={to}
      className={[
        "flex items-center gap-2 rounded-md px-3 py-1.5 transition hover:bg-zinc-100 dark:hover:bg-zinc-800",
        active
          ? "font-semibold text-zinc-900 dark:text-zinc-100"
          : "text-zinc-600 dark:text-zinc-300",
      ].join(" ")}
    >
      {icon}
      {label}
    </Link>
  );
}
