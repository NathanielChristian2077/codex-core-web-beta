import { Github, Home, LogIn, LogOut } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSession } from "../../store/useSession";

export default function AppHeader() {
  const loc = useLocation();
  const navigate = useNavigate();
  const isLogged = useSession((s) => s.isLogged);
  const logout = useSession((s) => s.logout);

  const onLogoClick = () => {
    if (loc.pathname === "/") return;
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-30 border-b border-zinc-200/70 bg-white/70 backdrop-blur-md dark:border-zinc-800/70 dark:bg-zinc-900/70">
      <div className="flex h-14 w-full items-center justify-between px-6">
        {/* Logo + name */}
        <button
          type="button"
          onClick={onLogoClick}
          className="flex items-center gap-3 text-sm font-semibold tracking-tight text-zinc-900 transition hover:opacity-80 dark:text-zinc-50"
        >
          <img
            src="/CodexCoreB.svg"
            className="h-7 w-7"
            alt="Codex Core logo"
          />
          <span className="hidden sm:inline">Codex Core</span>
        </button>
        {/* Nav */}
        <nav className="flex items-center gap-2 text-sm">
          <NavLink
            to="/"
            active={loc.pathname === "/"}
            icon={<Home className="h-4 w-4" />}
            label="Home"
          />

          {isLogged ? (
            <>
              <NavLink
                to="/dashboard"
                active={loc.pathname.startsWith("/dashboard")}
                label="Dashboard"
              />

              <button
                onClick={logout}
                className="inline-flex items-center gap-1.5 rounded-md border border-zinc-300 px-3 py-1.5 text-xs font-medium text-zinc-800 transition hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-100 dark:hover:bg-zinc-800"
                type="button"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span>Sign out</span>
              </button>
            </>
          ) : (
            <NavLink
              to="/login"
              active={loc.pathname.startsWith("/login")}
              icon={<LogIn className="h-4 w-4" />}
              label="Login"
            />
          )}

          {/* GitHub */}
          <a
            href="https://github.com/NathanielChristian2077/trabalho-final-web-dev.git"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium text-zinc-700 transition hover:bg-zinc-100 dark:text-zinc-200 dark:hover:bg-zinc-800"
          >
            <Github className="h-4 w-4" />
            <span className="hidden sm:inline">GitHub</span>
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
        "inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition",
        "hover:bg-zinc-100 dark:hover:bg-zinc-800",
        active
          ? "text-zinc-900 dark:text-zinc-50"
          : "text-zinc-600 dark:text-zinc-300",
      ].join(" ")}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
}
