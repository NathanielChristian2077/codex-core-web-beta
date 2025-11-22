"use client";

import api from "../../lib/apiClient";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../animate-ui/primitives/radix/dropdown-menu";

import {
  ChevronRight,
  ChevronsUpDown,
  Clock3,
  GitBranch,
  LayoutDashboard,
  LogOut,
  Map,
  Package,
  UserCog,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useIsMobile } from "../../hooks/use-mobile";

import { cn } from "../../lib/utils";
import { useCurrentCampaign } from "../../store/useCurrentCampaign";
import UserAvatar from "./UserAvatar";

import { listCampaigns } from "../../features/campaigns/api";
import type { Campaign } from "../../features/campaigns/types";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarInput,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
} from "../animate-ui/components/radix/sidebar";

import { useSession } from "../../store/useSession";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../animate-ui/primitives/radix/collapsible";
import { EditProfileDialog } from "./EditProfileDialog";

type AuthUser = {
  id: string;
  email: string;
  name?: string | null;
  avatarUrl?: string | null;
};

export default function SideBar() {
  const location = useLocation();
  const navigate = useNavigate();

  const [user, setUser] = useState<AuthUser | null>(null);
  const [userLoading, setUserLoading] = useState(true);

  const { currentCampaignId } = useCurrentCampaign();
  const setCurrentCampaign = useCurrentCampaign((s) => s.setCurrentCampaign);

  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loadingCampaigns, setLoadingCampaigns] = useState(false);

  const [dashboardOpen, setDashboardOpen] = useState(true);
  const [toolsOpen, setToolsOpen] = useState(!!currentCampaignId);

  const pathname = location.pathname;
  const hasCampaign = !!currentCampaignId;

  const isDashboard = pathname.startsWith("/dashboard");
  const isGraph = pathname.includes("/graph");
  const isTimeline = pathname.includes("/timeline");
  const isCharacters = pathname.includes("/characters");
  const isLocations = pathname.includes("/locations");
  const isObjects = pathname.includes("/objects");
  const [profileOpen, setProfileOpen] = useState(false);

  const isMobile = useIsMobile();

  const displayName = user?.name || "Game Master";
  const displayEmail = user?.email || "";

  useEffect(() => {
    let ignore = false;

    async function fetchMe() {
      try {
        setUserLoading(true);
        const { data } = await api.get<AuthUser>("/auth/me");
        if (!ignore) setUser(data);
      } catch {
        if (!ignore) {
          setUser({
            id: "unknown",
            email: "unknown@example.com",
            name: "Game Master",
            avatarUrl: null,
          });
        }
      } finally {
        if (!ignore) setUserLoading(false);
      }
    }

    fetchMe();

    return () => {
      ignore = true;
    };
  }, []);

  useEffect(() => {
    let ignore = false;

    async function fetchCampaigns() {
      try {
        setLoadingCampaigns(true);
        const data = await listCampaigns();
        if (!ignore) setCampaigns(data);
      } catch {
      } finally {
        if (!ignore) setLoadingCampaigns(false);
      }
    }

    fetchCampaigns();

    return () => {
      ignore = true;
    };
  }, []);

  useEffect(() => {
    if (currentCampaignId) {
      setToolsOpen(true);
    }
  }, [currentCampaignId]);

  function go(path: string, disabled?: boolean) {
    if (disabled) return;
    navigate(path);
  }

  function handleSelectCampaign(id: string) {
    setCurrentCampaign(id);
    setToolsOpen(true);
    navigate(`/campaigns/${id}/timeline`);
  }

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="flex items-center justify-between gap-2">
        <div className="flex flex-col">
          <button
            type="button"
            onClick={() => go("/dashboard")}
            className="text-sm font-semibold tracking-tight text-left"
          >
            Codex Core
          </button>
          <span className="text-[11px] text-zinc-500">Campaign manager</span>
        </div>
        <SidebarTrigger className="shrink-0" />
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            <Collapsible
              asChild
              open={dashboardOpen}
              onOpenChange={setDashboardOpen}
              className="group/collapsible"
            >
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton isActive={isDashboard} tooltip="Dashboard">
                    <LayoutDashboard className="shrink-0" />
                    <span className="truncate">Dashboard</span>
                    <ChevronRight className="ml-auto h-4 w-4 transition-transform duration-300 group-data-[state=open]/collapsible:rotate-90" />
                  </SidebarMenuButton>
                </CollapsibleTrigger>

                <CollapsibleContent>
                  <SidebarMenuSub>
                    {campaigns.length > 4 && (
                      <SidebarMenuSubItem>
                        <SidebarInput
                          placeholder="Search campaigns..."
                          className="h-7 text-xs"
                          readOnly
                        />
                      </SidebarMenuSubItem>
                    )}

                    {loadingCampaigns && (
                      <SidebarMenuSubItem>
                        <span className="text-[11px] text-zinc-500">
                          Loading campaigns...
                        </span>
                      </SidebarMenuSubItem>
                    )}

                    {!loadingCampaigns && campaigns.length === 0 && (
                      <SidebarMenuSubItem>
                        <span className="text-[11px] text-zinc-500">
                          No campaigns yet.
                        </span>
                      </SidebarMenuSubItem>
                    )}

                    {!loadingCampaigns &&
                      campaigns.map((c) => (
                        <SidebarMenuSubItem key={c.id}>
                          <SidebarMenuSubButton
                            asChild
                            size="sm"
                            isActive={currentCampaignId === c.id}
                          >
                            <button
                              type="button"
                              onClick={() => handleSelectCampaign(c.id)}
                              className="flex w-full items-center gap-2"
                            >
                              <span className="h-2 w-2 rounded-full bg-zinc-500" />
                              <span className="truncate text-xs">{c.name}</span>
                            </button>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}

                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton asChild size="sm">
                        <button
                          type="button"
                          onClick={() => go("/dashboard")}
                          className="flex w-full items-center gap-2 text-xs font-medium"
                        >
                          <span className="h-4 w-4 rounded-md border border-dashed border-zinc-500/60 text-[10px] flex items-center justify-center">
                            +
                          </span>
                          <span>New campaign</span>
                        </button>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>

            <Collapsible
              asChild
              open={toolsOpen}
              onOpenChange={setToolsOpen}
              className="group/collapsible"
            >
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton
                    tooltip="Tools"
                    isActive={
                      isGraph ||
                      isTimeline ||
                      isCharacters ||
                      isLocations ||
                      isObjects
                    }
                  >
                    <GitBranch className="shrink-0" />
                    <span className="truncate">Tools</span>
                    <ChevronRight className="ml-auto h-4 w-4 transition-transform duration-300 group-data-[state=open]/collapsible:rotate-90" />
                  </SidebarMenuButton>
                </CollapsibleTrigger>

                <CollapsibleContent>
                  {!hasCampaign && (
                    <div className="px-2 pb-1 pt-1.5 text-[11px] text-zinc-500">
                      Select a campaign in the dashboard to enable these tools.
                    </div>
                  )}

                  <SidebarMenuSub
                    className={cn(
                      !hasCampaign && "opacity-40 pointer-events-none"
                    )}
                  >
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton
                        asChild
                        size="sm"
                        isActive={isGraph}
                      >
                        <button
                          type="button"
                          onClick={() =>
                            go(
                              hasCampaign && currentCampaignId
                                ? `/campaigns/${currentCampaignId}/graph`
                                : "#",
                              !hasCampaign
                            )
                          }
                          className="flex w-full items-center gap-2"
                        >
                          <GitBranch className="h-3.5 w-3.5" />
                          <span className="truncate text-xs">Graph</span>
                        </button>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>

                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton
                        asChild
                        size="sm"
                        isActive={isTimeline}
                      >
                        <button
                          type="button"
                          onClick={() =>
                            go(
                              hasCampaign && currentCampaignId
                                ? `/campaigns/${currentCampaignId}/timeline`
                                : "#",
                              !hasCampaign
                            )
                          }
                          className="flex w-full items-center gap-2"
                        >
                          <Clock3 className="h-3.5 w-3.5" />
                          <span className="truncate text-xs">Timeline</span>
                        </button>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>

                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton
                        asChild
                        size="sm"
                        isActive={isCharacters}
                      >
                        <button
                          type="button"
                          onClick={() =>
                            go(
                              hasCampaign && currentCampaignId
                                ? `/campaigns/${currentCampaignId}/characters`
                                : "#",
                              !hasCampaign
                            )
                          }
                          className="flex w-full items-center gap-2"
                        >
                          <Users className="h-3.5 w-3.5" />
                          <span className="truncate text-xs">Characters</span>
                        </button>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>

                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton
                        asChild
                        size="sm"
                        isActive={isLocations}
                      >
                        <button
                          type="button"
                          onClick={() =>
                            go(
                              hasCampaign && currentCampaignId
                                ? `/campaigns/${currentCampaignId}/locations`
                                : "#",
                              !hasCampaign
                            )
                          }
                          className="flex w-full items-center gap-2"
                        >
                          <Map className="h-3.5 w-3.5" />
                          <span className="truncate text-xs">Locations</span>
                        </button>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>

                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton
                        asChild
                        size="sm"
                        isActive={isObjects}
                      >
                        <button
                          type="button"
                          onClick={() =>
                            go(
                              hasCampaign && currentCampaignId
                                ? `/campaigns/${currentCampaignId}/objects`
                                : "#",
                              !hasCampaign
                            )
                          }
                          className="flex w-full items-center gap-2"
                        >
                          <Package className="h-3.5 w-3.5" />
                          <span className="truncate text-xs">Objects</span>
                        </button>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          </SidebarMenu>
        </SidebarGroup>

        <SidebarSeparator />
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <UserAvatar name={displayName} imageUrl={user?.avatarUrl} />

                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">
                      {displayName}
                    </span>
                    {displayEmail && (
                      <span className="truncate text-xs text-zinc-500">
                        {displayEmail}
                      </span>
                    )}
                  </div>

                  <ChevronsUpDown className="ml-auto size-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>

              <DropdownMenuPortal>
                <DropdownMenuContent
                  className="z-50 min-w-56 rounded-lg w-[--radix-dropdown-menu-trigger-width] origin-top-right bg-zinc-200"
                  side={isMobile ? "bottom" : "top"}
                  align="end"
                  sideOffset={6}
                  alignOffset={-300}
                >
                  <DropdownMenuLabel className="p-0 font-normal">
                    <div className="flex items-center gap-2 px-2 py-2 text-left text-sm">
                      <UserAvatar
                        name={displayName}
                        imageUrl={user?.avatarUrl}
                      />
                      <div className="grid flex-1 leading-tight">
                        <span className="truncate font-semibold">
                          {displayName}
                        </span>
                        {displayEmail && (
                          <span className="truncate text-xs text-zinc-500">
                            {displayEmail}
                          </span>
                        )}
                      </div>
                    </div>
                  </DropdownMenuLabel>

                  <DropdownMenuSeparator />

                  <DropdownMenuGroup>
                    <DropdownMenuItem
                      onClick={() => setProfileOpen(true)}
                      className={cn(
                        "flex items-center gap-2 px-2 py-1.5 text-sm rounded-md outline-hidden ring-sidebar-ring",
                        "text-sidebar-foreground",
                        "[&:not([data-highlight])]:hover:bg-sidebar-accent [&:not([data-highlight])]:hover:text-sidebar-accent-foreground",
                        "active:bg-sidebar-accent active:text-sidebar-accent-foreground",
                        "focus-visible:ring-2",
                        "cursor-pointer hover:opacity-95 active:opacity-80"
                      )}
                    >
                      <UserCog className="h-4 w-4 shrink-0" />
                      <span>Account</span>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem
                    onClick={() => {
                      localStorage.removeItem("accessToken");
                      window.location.href = "/";
                      useSession().logout();
                    }}
                    className={cn(
                      "flex items-center gap-2 px-2 py-1.5 text-sm rounded-md outline-hidden ring-sidebar-ring",
                      "text-sidebar-foreground",
                      "[&:not([data-highlight])]:hover:bg-sidebar-accent [&:not([data-highlight])]:hover:text-sidebar-accent-foreground",
                      "active:bg-sidebar-accent active:text-sidebar-accent-foreground",
                      "focus-visible:ring-2",
                      "cursor-pointer hover:opacity-95 active:opcity-80"
                    )}
                  >
                    <LogOut className="h-4 w-4 shrink-0" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenuPortal>
              <EditProfileDialog
                open={profileOpen}
                onOpenChange={setProfileOpen}
                initialName={user?.name}
                initialEmail={user?.email}
              />
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
