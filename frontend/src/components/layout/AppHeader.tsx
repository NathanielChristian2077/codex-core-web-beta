import { Link, useLocation } from "react-router-dom";
import { useSession } from "../../store/useSession";

export default function AppHeader() {
  const loc = useLocation();
  const isLogged = useSession((s) => s.isLogged);
  const logout = useSession((s) => s.logout);

  return (
    <header className="sticky top-0 z-20 border-b bg-white/70 backdrop-blur-md dark:bg-zinc-900/60">
      <div className="mx-auto flex h-14 w-full max-w-screen-2xl items-center justify-between px-6">
        
        {/* Logo */}
        <Link
          to="/"
          className="text-lg font-semibold tracking-tight hover:opacity-80 transition"
        >
          Codex Core
        </Link>

        {/* Nav */}
        <nav className="flex items-center gap-4 text-sm">
          <NavLink to="/" active={loc.pathname === "/"} label="Home" />

          {isLogged ? (
            <>
              <NavLink
                to="/dashboard"
                active={loc.pathname.startsWith("/dashboard")}
                label="Dashboard"
              />

              {/* Sign out */}
              <button
                onClick={logout}
                className="rounded-md border px-3 py-1.5 text-zinc-700 hover:bg-zinc-100 dark:text-zinc-200 dark:border-zinc-700 dark:hover:bg-zinc-800 transition"
              >
                Sign out
              </button>
            </>
          ) : (
            <NavLink
              to="/login"
              active={loc.pathname.startsWith("/login")}
              label="Login"
            />
          )}

          {/* GitHub */}
          <a
            href="https://github.com/NathanielChristian2077/trabalho-final-web-dev.git"
            target="_blank"
            className="rounded-md px-3 py-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
          >
            GitHub
          </a>
        </nav>
      </div>
    </header>
  );
}

function NavLink({ to, label, active }: { to: string; label: string; active: boolean }) {
  return (
    <Link
      to={to}
      className={[
        "rounded-md px-3 py-1.5 transition hover:bg-zinc-100 dark:hover:bg-zinc-800",
        active
          ? "font-semibold text-zinc-900 dark:text-zinc-100"
          : "text-zinc-600 dark:text-zinc-300",
      ].join(" ")}
    >
      {label}
    </Link>
  );
}
