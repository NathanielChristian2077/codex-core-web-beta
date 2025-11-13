import { Link, useLocation } from "react-router-dom";
import { useCurrentCampaign } from "../../store/useCurrentCampaign";
import UserAvatar from "./UserAvatar";

export default function SideBar() {
  const loc = useLocation();
  const { currentCampaignId } = useCurrentCampaign();

  const activeRoot = (p: string) =>
    loc.pathname.startsWith(p) ? "bg-zinc-100 dark:bg-zinc-800" : "";

  const ACTIVE_CLS = "bg-zinc-100 dark:bg-zinc-800";
  const hasCampaign = !!currentCampaignId;

  const isCharacters = loc.pathname.includes("/characters");
  const isLocations = loc.pathname.includes("/locations");
  const isObjects = loc.pathname.includes("/objects");

  const user = { name: "Game Master", email: "mestre@ex.com", imageUrl: "" };

  return (
    <aside className="flex h-dvh w-64 flex-col border-r bg-white/70 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/70">
      <div className="px-4 pb-2 pt-4">
        <Link to="/" className="block text-sm font-semibold tracking-tight">
          Codex Core
        </Link>
      </div>

      <nav className="mt-2 flex-1 space-y-1 px-2 text-sm">
        <NavItem
          to="/dashboard"
          label="Dashboard"
          activeClass={activeRoot("/dashboard")}
        />

        <Section label="Tools" />

        {!hasCampaign && (
          <p className="px-3 pb-2 text-xs text-zinc-500">
            Select a campaign in the dashboard to enable these tools.
          </p>
        )}

        <NavItem
          to={hasCampaign ? `/campaigns/${currentCampaignId}/graph` : "#"}
          label="Graph"
          activeClass={loc.pathname.includes("/graph") ? ACTIVE_CLS : ""}
          disabled
        />

        <NavItem
          to={
            hasCampaign
              ? `/campaigns/${currentCampaignId}/characters`
              : "#"
          }
          label="Characters"
          activeClass={isCharacters ? ACTIVE_CLS : ""}
          disabled={!hasCampaign}
        />

        <NavItem
          to={
            hasCampaign
              ? `/campaigns/${currentCampaignId}/locations`
              : "#"
          }
          label="Locations"
          activeClass={isLocations ? ACTIVE_CLS : ""}
          disabled={!hasCampaign}
        />

        <NavItem
          to={
            hasCampaign
              ? `/campaigns/${currentCampaignId}/objects`
              : "#"
          }
          label="Objects"
          activeClass={isObjects ? ACTIVE_CLS : ""}
          disabled={!hasCampaign}
        />

        <Section label="Settings" />
        <NavItem
          to="/settings/profile"
          label="Profile"
          activeClass={activeRoot("/settings/profile")}
        />
      </nav>

      <div className="border-t px-3 py-3 text-xs dark:border-zinc-800">
        <div className="flex items-center gap-2">
          <UserAvatar name={user.name} imageUrl={user.imageUrl} />
          <div className="min-w-0 flex-1">
            <div className="truncate text-xs font-medium">{user.name}</div>
            <div className="truncate text-[11px] text-zinc-500">
              {user.email}
            </div>
          </div>
        </div>

        <div className="mt-3 flex gap-2">
          <Link
            to="/settings/profile"
            className="flex-1 rounded border px-2 py-1 text-center text-xs hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-900"
          >
            Manage
          </Link>
          <button
            type="button"
            className="flex-1 rounded border px-2 py-1 text-center text-xs hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-900"
            onClick={() => {
              localStorage.removeItem("accessToken");
              window.location.href = "/login";
            }}
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
  const cls =
    "block rounded px-3 py-2 hover:bg-zinc-100 dark:hover:bg-zinc-800" +
    (activeClass ? " " + activeClass : "") +
    (disabled ? " opacity-50 pointer-events-none" : "");
  return (
    <Link to={to} className={cls}>
      {label}
    </Link>
  );
}

function Section({ label }: { label: string }) {
  return (
    <div className="px-3 pt-4 text-xs font-medium uppercase text-zinc-500">
      {label}
    </div>
  );
}
