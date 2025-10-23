import { Link, useLocation } from "react-router-dom";
import UserAvatar from "./UserAvatar";

export default function SideBar() {
  const loc = useLocation()
  const active = (p: string) => (loc.pathname.startsWith(p) ? "bg-zinc-100 dark:bg-zinc-800" : "");

  // Demo... Mudar para decodificação do JWT para pegar nome/email
  const user = { name: "Game Master", email: "mestre@ex.com", imageUrl: "" };

  return (
    <aside className="flex h-dvh w-64 flex-col border-r bg-white/70 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/70" >
      <div className="px-4 pb-2 pt-4">
        <Link to="/" className="block text-sm font-semibold tracking-tight">
          Codex Core
        </Link>
      </div>
      <nav className="mt-2 flex-1 space-y-1 px-2 text-sm">
        <NavItem to="/dashboard" label="Dashboard" activeClass={active("/dashboard")} />
        <NavItem to="/campanhas" label="Campaigns" activeClass={active("/campanhas")} disabled />
        <Section label="Tools" />
        <NavItem to="/graph" label="Graph" activeClass={active("/graph")} disabled />
        <NavItem to="/characters" label="Characters" activeClass={active("/characters")} disabled />
        <NavItem to="/locations" label="Locations" activeClass={active("/locations")} disabled />
        <NavItem to="/objects" label="Objects" activeClass={active("/objects")} disabled />
        <Section label="Settings" />
        <NavItem to="/settings/profile" label="Profile" activeClass={active("/settings/profile")} />
      </nav>

      <div className="border-t px-3 py-3 dark:border-zinc-800">
        <div className="flex item-center gap-3">
          <UserAvatar name={user.name} email={user.email} imageUrl={user.imageUrl} />
          <div className="min-w-0">
            <div className="truncate text-sm font-medium" >{user.name}</div>
            <div className="truncate text-zinc-600 dark:text-zinc-400" >{user.email}</div>
          </div>
        </div>
        <div className="mt-3 flex gap-2">
          <Link to="/settings/profile" className="flex-1 rounded border px-3 py=1.5 text-center text-sm hover:bg-zinc-50 dark:hover:bg-zinc-900">
            Manage
          </Link>
          <button
            onClick={() => {
              localStorage.removeItem("token");
              location.href = "/login";
            }}
            className="flex-1 rounded border px-3 py-1.5 text-center text-sm hover:bg-zinc-50 dark:hover:bg-zinc-900"
          >
            Sign out
          </button>
        </div>
      </div>
    </aside>
  );
}

function NavItem({
  to,
  label,
  activeClass,
  disabled,
}: {
  to: string;
  label: string;
  activeClass?: string;
  disabled?: boolean;
}) {
  const cls = "block rounded px-3 py-2 hover:bg-zinc-100 dark:hover:bg-zinc-800" +
    (activeClass || "") +
    (disabled ? " opacity-50 pointer-events-none" : "");
  return (
    <Link to={to} className={cls}>
      {label}
    </Link>
  );
}

function Section({ label }: { label: string }) {
  return <div className="px-3 pt-4 text-xs font-medium uppercase text-zinc-500">{label}</div>;
}
